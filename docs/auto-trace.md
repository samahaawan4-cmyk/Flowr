# Auto Trace — 0.39

Open the Masks drawer with **M**, then choose **Auto Trace · text / PNG**. Auto Trace creates editable mask paths from the selected layer's source. It runs locally; it does not upload the image or text to a service.

1. Choose **Alpha / transparency** for text and transparent PNGs. Use **Bright regions** or **Dark regions** for high-contrast opaque artwork.
2. Adjust **Threshold** (1–255), **Tolerance** (0.1–12 layer pixels), **Minimum area** (square layer pixels), and **Smooth curves**. Settings update the preview; Update trace also runs it again.
3. Review green outer Add paths and orange Subtract holes. Disconnected regions remain separate. The status shows paths, holes and vertex counts.
4. Choose **Add traced masks to layer**. Existing masks are retained, and all new paths form one Undo action. Cancel leaves the layer unchanged.
5. Edit any traced path using the normal Bézier editor, Move/Transform tools, feather, expansion, mask mode, inversion and Mask Path animation.

## Source behavior

Text uses its complete source lettering, font, fill/stroke and typography settings. Character animation, text glow and text-box fill are excluded, so a fully invisible entrance frame can still trace the source text. Image and video sources use their decoded pixels; video tracing is a snapshot of the currently decoded frame. Shapes, drawings, precomps and 3D layer snapshots can also supply alpha.

Owner masks, effects, layer opacity and layer/parent transforms do not distort source tracing. Paths are stored in the same local coordinates as the source and follow normal transforms afterward. Child content inside a precomp retains its rendered appearance.

Alpha on an opaque PNG/JPG produces the image boundary. Bright/Dark can isolate flat, high-contrast artwork; they do not automatically identify a person against a complex photographic background. This feature is contour tracing, not AI background removal or motion tracking. Source/text changes do not regenerate static traces automatically; trace again when needed. For native animated text or a video seed mask, use the separate [Mask motion tracking](mask-tracking.md) tools.

## Quality and limits

Capture samples up to 1536 pixels on the longest side, with up to 2× sampling for small sources. Binary pixel boundaries preserve separate regions and holes, including diagonal contacts. Closed-path simplification reduces vertex count; optional tangent smoothing softens gradual turns while retaining sharp corners. Tiny regions can be excluded using Minimum area. Increase detail by lowering tolerance; edge accuracy still depends on sampling and threshold.

Each contour is one native mask. A layer holds up to 32 masks including existing ones; Apply is disabled when the complete trace will not fit. It never silently applies only part of a trace. Raise Minimum area, simplify the source or remove unused masks. Complex contours adapt their tolerance to fit 512 vertices, with a status notice. Very noisy sources have edge/region guards. The preview shows the first 128 paths for excessively complex results; the full count is reported.

## Checks

`check-auto-trace.cjs` verifies B/O outlines and counters, disjoint alpha regions, contrast channels, threshold/filter behavior, preview/apply, Cancel, single Undo/Redo and save/reopen. `check-auto-trace-media.cjs` checks 60 binary reconstruction fixtures, a decoded transparent PNG under rotation/scale/flip, exclusion of existing masks, full text source at an invisible animation frame, capacity preflight and mobile/landscape layout. Both use Playwright; set `FLOWR_CHROMIUM` to your Chromium executable.
