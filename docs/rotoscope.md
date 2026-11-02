# Rotoscope Brush

Rotoscope Brush builds a foreground alpha matte for one selected image or video layer. It is a separate tool from Auto Trace (editable vector contours) and Auto Track Mask (moving an existing Bézier path). The panel matches the main mobile app frame. Source preview is separate from analysis: up to 2048 source pixels remain available for inspection regardless of working-matte size. This fixes the previous enlargement of a 256px source image. At higher zoom a source larger than 2048px may still be limited by this preview cap; export uses the original source media.

All analysis runs on the device; there is no account, cloud service or model download.

## Cut out a character

1. Import an image or video, select its layer, then open **M → Rotoscope Brush · character cutout**. The workspace shows only that source, without other layers, effects or layer transforms.
2. Use the default **+ Smart Brush** to stroke inside the character. It grows a connected region toward detected color edges and estimates background from the image border. No box or initial red stroke is required. Stroke across differently colored body parts if necessary. An unrelated disconnected region needs its own green stroke. Hold **Alt** to temporarily subtract, or select **− Remove**. A magenta boundary and live draft preview show the selection while drawing.
3. **Edge-aware brush** clips each brush stamp to connected similar colors around its center. This prevents a large brush near a strong edge from forcing the nearby background into the foreground; Brush tolerance controls how much color variation a stamp accepts. Turn it off for an ordinary circular hard brush.
4. Optionally draw a loose **Subject box** around the character. The box's center initializes foreground; green strokes can identify the correct subject if that center falls on background. Alternatively, paint both **+ Smart Brush** and **− Remove** strokes without a box. Existing masks offer **Roto from this mask** to initialize the silhouette.
5. Auto update refines after a stroke. Green retains foreground; red removes background, including holes between arms or legs. Use **Refine edge** on difficult boundaries, **Erase stroke** to remove a constraint, and **Undo stroke** to restore both the brush map and its previous working matte. A box outside the source is clipped safely.
6. Switch between Source, Overlay, Cutout, Alpha matte, On black and On white. Zoom up to 800% and use Pan to inspect edges. Fit respects both viewport dimensions. The Alpha view includes the source's original transparency.
7. For PNGs, **Use source alpha** initializes from transparency. Source alpha is retained in the final render rather than multiplied into the stored matte twice.

Foreground/background strokes are hard constraints. They remain respected after segmentation feathering. Refine-edge strokes request fractional-alpha estimation, rather than forcing a pixel in or out.

## Propagate video

Choose Forward or Backward, an end time, and the sample rate. The default is the composition frame rate. **Propagate cutout** tracks foreground features, warps the silhouette and brush constraints, then segments each decoded frame again. Tracking combines foreground image features with a bounded RGB patch-motion field, local forward/backward consistency, and appearance validation of automatic seeds. Sparse output rates use at least 15 internal motion steps per second before refining each output sample; the internal steps are not stored as additional frozen frames. This helps fast travel and local limb motion, but costs more analysis time. It uses an independent video decoder; analysis never scrubs the original layer or moves the composition playhead.

The strip shows manual correction anchors in purple and propagated samples in green. Scrub to review. If motion or silhouette overlap becomes unreliable, analysis stops and keeps only completed draft samples. Go to a visible frame, mark foreground/background, refine, and continue. **Go to stopped frame** opens the frame requiring a correction. The visible source, brush map and alpha restore to the last accepted sample on failure or Stop. Automatic foreground seeds that no longer match the preceding foreground appearance can be reclassified after occlusion instead of being kept as ghosts. A scene cut or lost appearance still stops analysis. **Stop** retains completed draft samples; **Cancel** discards the entire session.

Correcting a frame makes it a manual anchor and removes stale propagated samples between the neighboring manual anchors on both sides. Earlier/later manual corrections survive. Propagating again carries corrected strokes through motion. A correction can therefore be propagated forward and backward from a clean frame.

Lower sample rates are faster, but hold the nearest sample between analyzed frames; they do not invent intermediate subject motion. Use the composition frame rate for the smoothest result. Frames without an analyzed sample are transparent by default. **Hold nearest matte** explicitly extends the nearest sample through gaps and outside the span.

## Edge controls

| Control | Behavior |
| --- | --- |
| Selection engine | Smart connected edges is the default. Classic graph cut retains the previous workflow for manual boxes/stroke maps. Smart selection uses edge connectivity and perceptual color; it does not infer object identity. |
| Selection reach | Biases uncertain connected regions toward foreground or background. Existing explicit marks remain hard constraints. |
| Working size | 256, 384 (default), 512, 768 or 1024 pixels on the longest source dimension. 768/1024 modes use a maximum 512-pixel region solve followed by higher-resolution local edge refinement. Larger sources are downsampled; export scales the resulting alpha. Once matte frames exist, size is fixed for that session. |
| Refinement passes | Re-estimates foreground/background color mixtures and the graph cut, up to four passes. |
| Refine radius | Width of the boundary band for color-based fractional-alpha estimation. |
| Feather / Shift edge | Smooths the matte or expands/contracts the segmentation boundary, in working-matte pixels. |
| Edge strength | Strength of color-sensitive spatial continuity. |
| Remove specks | Removes small unmarked islands/holes while retaining regions with hard brush constraints. |
| Reduce chatter | Stabilizes compatible fractional edge alpha against the motion-warped preceding matte. |
| Remove color fringe | Removes estimated background color from partially covered edge pixels. Review on black and white; mismatched background estimates can alter edge color. |
| Motion search | Search radius for propagated silhouette constraints and low-texture translation recovery. Large jumps may still need a new manual anchor. |

## Freeze, save and render

**Freeze & Apply** commits the draft in one project Undo action. The optional seed mask can be removed as a guide; other masks remain. Ordinary masks intersect the cutout, and the matte follows the layer's position, anchor, rotation, scale, flips, parenting and nested composition. Layer effects process the cutout afterwards.

The Masks drawer then offers Edit, Bypass, Remove, Invert, final feather/edge shift, color-fringe removal and outside-span behavior. Final finishing adjustments do not rerun segmentation. Reopening retains brush constraints, manual anchors, resolution and sample rate. Mattes are indexed by source time, so moving or trimming the video clip retains the corresponding subject frame.

Save the project normally. Compressed matte frames are embedded in project state and portable `.flowr` backups along with the source media; no external matte files are needed. PNG export preserves alpha. Existing video exports composite against black and do not encode a transparent video channel.

## Practical limits

- Up to **600 analyzed matte frames per layer**, across all sessions/ranges. Split longer videos into separate layers. A 600-frame range at 30 fps is about 20 seconds.
- Each frozen matte must fit within **900,000 base64 characters** of compressed project data. Noisy, highly detailed mattes may reach that limit earlier. Shorten the range or use a lower working size. The browser's total project-storage quota still applies across all layers.
- Working alpha is at most 1024 pixels on the longest dimension. Fine hair, motion blur, translucent objects, similar foreground/background colors, rapid pose changes and occlusion require brush corrections and careful review. A successful freeze does not imply an inspected result at every frame.
- This implements a classic, local graph-cut and motion-assisted workflow. It does **not** contain Adobe's proprietary neural Roto Brush engine and cannot guarantee identical After Effects results. Refine edge estimates alpha from local color separation; it is not semantic hair reconstruction or generative inpainting.
- Desktop Chromium automation is tested. Physical Android speed, memory limits, device codecs and native sharing still require device testing; this ZIP contains source, not an APK.

## Implementation and checks

`roto-engine.js` contains perceptual-color minimax geodesic selection, connected-component constraints, connected edge-aware brush stamps, bounded multiscale detail refinement, spatially local edge-color estimation, diagonal RGB mixture models, color-sensitive grid graph cuts with push-relabel max flow, brush constraints, component cleanup and fractional-alpha edge refinement. `roto-flow.js` adds bounded RGB patch tracking and a local deformation field. `rotoscope.js` owns worker jobs, the isolated editing session, optical-flow/deformation propagation and review controls. `roto-store.js` compresses alpha/brush runs, validates restored data and integrates the matte into layer rendering before effects. Mattes stay transparent while loading or after invalid data, so uncut source frames cannot flash through.

The method draws on the classical [GrabCut paper](https://www.microsoft.com/en-us/research/publication/grabcut-interactive-foreground-extraction-using-iterated-graph-cuts/) and [OpenCV's description of interactive foreground extraction](https://docs.opencv.org/4.x/d8/d83/tutorial_py_grabcut.html); the implementation is local JavaScript and has no OpenCV runtime dependency.

Run with Node and Playwright/Chromium installed:

```sh
node tests/check-roto-preview-resolution.cjs
node tests/check-roto-local-motion.cjs
node tests/check-roto-articulated-video.cjs
node tests/check-smart-roto.cjs
node tests/check-smart-roto-ui.cjs
node tests/check-roto-engine.cjs
node tests/check-rotoscope-ui.cjs
node tests/check-roto-corrections.cjs
node tests/check-rotoscope-video.cjs
node tests/check-roto-render.cjs
node tests/check-roto-layout.cjs
```

Set `FLOWR_CHROMIUM` to the Chromium executable if necessary. These checks exercise segmentation and holes, soft edges, real pointer corrections, Undo/Stop/Cancel, forward/backward propagation, source-time trim/move, saved-media reload, transformed/nested rendering, PNG export pixels, finishing controls and compact layouts. Existing mask/tracking and text-preset regression tests are retained.

The Smart Brush behavior follows the broad foreground-stroke / subtract-stroke interaction described in [Adobe’s Roto Brush guide](https://helpx.adobe.com/after-effects/desktop/roto-brush-and-refine-matte/roto-brush/roto-brush-refine-matte.html). Its selection implementation is independent and local; no Adobe engine or neural model is bundled. Live feedback uses a temporary 144-pixel edge preview, replaced with the full analysis on release. The preview never enters project state or exports. Automatic border background is conservative when it resembles a foreground mark; mark red background explicitly for subjects filling the frame.
