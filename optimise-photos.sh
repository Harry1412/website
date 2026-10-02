#!/usr/bin/env bash
#
# optimise-photos.sh — scale gallery photos and strip metadata.
#
# Rescales every image in src/images so its longest side is at most
# MAX_DIMENSION px (default 1600) and re-encodes it as progressive JPEG with
# all metadata stripped (EXIF, GPS, device tags, colour profiles, comments).
# Intended for iPhone photos, which are far larger than the gallery renders
# them. Uses ImageMagick.
#
# Usage:
#   ./optimise-photos.sh              # optimise in place
#   ./optimise-photos.sh --dry-run    # report what would happen, change nothing
#   ./optimise-photos.sh --backup     # keep a .orig copy of each original
#   ./optimise-photos.sh 1600         # custom max longest-side, in pixels
#
set -euo pipefail

MAX_DIMENSION=2000
JPEG_QUALITY=78
IMAGE_DIR="src/images"
DRY_RUN=false
BACKUP=false

usage() {
	sed -n '3,15p' "$0" | sed 's/^# \{0,1\}//'
	exit 0
}

human() { awk -v b="$1" 'BEGIN{ printf "%.2f MB", b/1048576 }'; }

# ---- argument parsing ------------------------------------------------------
while [[ $# -gt 0 ]]; do
	case "$1" in
	-h | --help) usage ;;
	--dry-run) DRY_RUN=true ;;
	--backup) BACKUP=true ;;
	'' | *[!0-9]*)
		echo "error: '$1' is not a valid argument or positive integer" >&2
		usage
		;;
	*)
		if [[ "$1" -le 0 ]]; then
			echo "error: max dimension must be greater than zero" >&2
			exit 1
		fi
		MAX_DIMENSION="$1"
		;;
	esac
	shift
done

# ---- preflight -------------------------------------------------------------
if command -v magick >/dev/null 2>&1; then
	MAGICK="magick"
elif command -v convert >/dev/null 2>&1; then
	MAGICK="convert"
else
	echo "error: ImageMagick not found. Install it with:" >&2
	echo "         sudo apt-get install -y imagemagick" >&2
	exit 1
fi

if [[ ! -d "$IMAGE_DIR" ]]; then
	echo "error: '$IMAGE_DIR' not found." >&2
	exit 1
fi

# ---- collect images --------------------------------------------------------
shopt -s nullglob
images=()
for ext in jpg jpeg jpe JPG JPEG JPE png PNG heic heif HEIC HEIF; do
	images+=("$IMAGE_DIR"/*."$ext")
done
shopt -u nullglob

if [[ ${#images[@]} -eq 0 ]]; then
	echo "No images found in $IMAGE_DIR."
	exit 0
fi

echo "ImageMagick: $MAGICK"
echo "Max longest side: ${MAX_DIMENSION}px  |  JPEG quality: ${JPEG_QUALITY}"
[[ "$BACKUP" == true ]] && echo "Backups: originals will be kept as *.orig"
if [[ "$DRY_RUN" == true ]]; then
	echo "DRY RUN — no files will be modified."
fi
echo

total_before=0
total_after=0
processed=0
skipped=0

for img in "${images[@]}"; do
	name="$(basename "$img")"
	size_before=$(stat -c%s "$img")

	# longest side, for reporting
	longest=$("$MAGICK" identify -format '%[fx:max(w,h)]' "$img" 2>/dev/null || echo 0)

	# non-JPEG inputs become .jpg (HEIC etc. are read-only in most builds and
	# aren't web-displayable anyway); JPEG inputs are overwritten in place
	lower=${name,,}
	case "$lower" in
	jpg | jpeg | jpe) out="$img" ;;
	*) out="${img%.*}.jpg" ;;
	esac

	if [[ "$longest" -gt "$MAX_DIMENSION" ]]; then
		desc="scale ${longest} → ${MAX_DIMENSION}px"
	else
		desc="re-encode (${longest}px, within limit)"
	fi
	[[ "$out" != "$img" ]] && desc="$desc → $(basename "$out")"
	printf '  %-26s %s\n' "$name" "$desc"

	if [[ "$DRY_RUN" == true ]]; then
		total_after=$((total_after + size_before))
		continue
	fi

	if [[ "$BACKUP" == true && ! -f "$img.orig" ]]; then
		cp -p "$img" "$img.orig"
	fi

	tmp="$img.optimising"
	# -auto-orient bakes in any EXIF rotation BEFORE we strip EXIF, so
	# orientation-dependent photos don't end up sideways.
	if ! "$MAGICK" "$img" \
		-auto-orient \
		-strip \
		-resize "${MAX_DIMENSION}x${MAX_DIMENSION}>" \
		-interlace Plane \
		-quality "$JPEG_QUALITY" \
		"$tmp" 2>/dev/null; then
		echo "    ! failed to process $name" >&2
		rm -f "$tmp"
		skipped=$((skipped + 1))
		total_before=$((total_before + size_before))
		total_after=$((total_after + size_before))
		continue
	fi

	mv -f "$tmp" "$out"
	size_after=$(stat -c%s "$out")
	processed=$((processed + 1))
	total_before=$((total_before + size_before))
	total_after=$((total_after + size_after))
done

echo
if [[ "$DRY_RUN" == true ]]; then
	echo "Would process ${#images[@]} image(s) — nothing was changed."
elif [[ "$processed" -eq 0 ]]; then
	echo "Nothing was processed."
else
	saved=$(awk -v a="$total_before" -v b="$total_after" 'BEGIN{ printf "%.0f%%", (1-(b/a))*100 }')
	echo "Processed $processed image(s)."
	echo "Total: $(human "$total_before") → $(human "$total_after")  (${saved} smaller)"
fi
[[ "$skipped" -gt 0 ]] && echo "Skipped/failed: $skipped"