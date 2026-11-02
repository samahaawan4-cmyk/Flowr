# Mask motion tracking — 0.41

## Animated text

Select a text layer and open **M → Follow text animation**. Flowr creates live editable-mask objects for each character outline/counter, linked to the glyph transforms from its own text engine. This follows native Rise/Drop/Pop, animator position/rotation/scale/tracking, range selectors, stagger and loops without optical-flow estimation. Layer and parent transforms continue to apply normally.

Live geometry follows at preview/export sample times and includes the letter holes. Overlapping glyphs preserve each other's visible pixels. This mode traces glyph geometry, so blur/glow are not vector shape deformations; adjust mask feather/expansion if needed.

A text/font/content/style change that invalidates the binding disables the stale live masks. Use **Rebuild text tracking** to regenerate them. Layout and geometric animation remain live. Rebuilding replaces existing live text-following masks and static Auto Trace paths on that text layer while retaining unrelated manual masks. Masks on other layers are never converted. The total 32-mask layer limit still applies.

For a manually drawn text seed, choose its **Auto Track Mask → Follow native text animation**. That seed and the text layer’s static Auto Trace batch are replaced by live character masks. To edit a live path's vertices or shape keys, choose **Freeze text tracking** at the desired frame; it becomes a normal mask. Mask opacity, expansion and feather remain independently editable/keyframable while the path is live.

## Character/object motion in video

1. Pause on a clear seed frame. Draw a closed mask around the subject, with enough corners/texture inside it. Make the contour reasonably tight so textured background features do not dominate.
2. On that mask card, choose **Auto Track Mask**. The current playhead is the seed time. Near the layer end, the dialog defaults to Backward so there is a usable range.
3. Choose Forward or Backward, an end time inside the layer, sample rate (5/10/15/30), and a motion model.
4. **Analyze motion**. Progress and a mask overlay show each decoded sample. **Stop analysis** preserves partial results for review; Close discards the analysis without changing the layer.
5. Scrub the Review slider. The status reports confidence loss or a completed range. Apply only after checking the contour through pose changes.
6. **Apply tracked keys** writes ordinary Mask Path keys over the successfully analyzed range and keeps existing keys outside that range. It is a single Undo action. The shape remains manually editable afterward.

| Model | Use |
| --- | --- |
| Move only | Translation with a stable-size subject |
| Move / scale / rotate | Rigid/similarity motion and moderate perspective changes approximated by that model |
| Deform / character motion | Global motion plus a local residual field to propagate moderate pose/limb movement |

The tracker is a local pyramidal optical-flow feature tracker with forward/backward checks and robust motion fitting. It does not understand body parts or regenerate hidden contours. Occlusion, cuts, repeated textures, low contrast, large frame-to-frame movement, changing silhouettes and fast out-of-plane poses can cause drift or tracking loss. Increase sample rate, refine the seed, or create a corrected seed at another time and analyze the next range. The confidence number describes retained motion features, not a guarantee of boundary accuracy.

## What is automatic already

An image/PNG mask already follows its own layer's position, rotation, scale, flips, anchor and parenting. The tracking dialog explains this for still images. Video-content tracking is for movement *inside* a decoded video frame. Animated GIF/image sources are not analyzed as a seekable video sequence.

## Performance and saved data

Analysis uses a separate muted decoder and does not seek the original video or move the app playhead. Frame capture waits until the seeked frame is ready for presentation. Applying results validates the video source, timing, dimensions and seed path; unrelated UI/layer-transform changes do not invalidate analysis. Frames are analyzed up to a 640-pixel longest side, with up to 600 samples per run. The preview stores small temporary thumbnails; saved projects store paths and tracking metadata, not analysis images.

Redundant samples are reduced to linear shape keys, keeping vertices and Bézier control points within approximately 0.4 tracking pixels (or 0.15 layer pixels minimum) of the sampled motion. Applied coordinates are rounded to 0.001 layer pixels. A 12,000 vertex/key budget prevents oversized results from overwhelming project storage; simplify the seed or shorten the range if the result exceeds it. Other projects/media can still use the browser's existing storage quota.

Native text follow is continuous rather than baked frame keys. Video tracking is assisted mask propagation, not AI rotoscoping, automatic background removal or guaranteed tracking through occlusion. Physical Android performance has not been measured.

## Checks

- `check-text-mask-tracking.cjs`: Rise + loop, counters, overlapping letters, invisible frames, persistence, PNG export, stale-binding guard and Freeze/Undo.
- `check-mask-optical-flow.cjs`: translation, rotation/scale, local limb displacement, complete occlusion rejection and temporal key reduction.
- `check-video-mask-tracking.cjs`: decoded moving video, deformation, review, original-decoder/playhead isolation, forward/backward analysis, Stop/Close, range keys, Undo/Redo and save/reopen.

These Playwright checks use the included synthetic video fixture; set `FLOWR_CHROMIUM` to your Chromium executable.
