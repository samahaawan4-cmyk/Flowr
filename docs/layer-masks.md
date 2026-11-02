# Layer masks — 0.38

Use a mask to retain part of an image/video, remove a background, or cut holes in any visual layer. This is a manual Bézier cutout workflow. For native text motion and assisted video tracking, see [Mask motion tracking](mask-tracking.md). Automatic subject segmentation, Roto Brush and proprietary After Effects mask import are not included.

## Cut out a character

1. Select the image or video layer. Open **M** on the left of the preview, or **Transform → Masks**.
2. Choose **Pen mask**. Click/tap around the character. Drag while placing a point to create curve handles; click the first point or **Close path** to close the outline.
3. Use **Select** to move vertices and their yellow handles. Alt-drag a handle to break symmetry on desktop. **Smooth / Corner** converts the selected point. **+ Vertex** splits the nearest Bézier segment without changing its shape; **− Vertex** removes the selected point.
4. Switch between **Layer source** and **Layer cutout** to inspect only the selected layer. The header names the target layer. **Composition context** deliberately shows the full composition; adjustment layers use that view by default. Zoom from Fit to 800%; use **Pan** to move around the zoomed preview. The viewport also has scrollbars. **Undo edit** reverses local path edits; **Cancel** discards the draft.
5. Choose **Done**. Add masks retain the inside. Refine **Feather X/Y** and **Expansion** for the edge. Use a Subtract mask for holes such as a space between an arm and the body.

Rectangle and Ellipse are drag tools. They create editable vertices and cubic handles. Masks are closed paths using the nonzero fill rule.

## Several masks on one layer

Use **+ Add another mask** in the Masks drawer as many times as needed. The count at the top shows how many masks belong to the selected layer. Choose **New mask mode** before drawing; the new path is appended without replacing existing masks. Add masks keep separate regions; Subtract cuts holes; Intersect restricts the result. Reorder with ↑/↓ when the operation order matters. Each mask has independent geometry, properties, keys, inversion, visibility and removal.

The color swatch changes only the editing outline. While editing one path, other masks appear as named colored outlines; disabled masks are dimmed. **Other masks** toggles those guides without changing the cutout.

## Advanced path editing

**Move mask** lets you drag all vertices together. Under **Transform / copy path**, enter X/Y translation, independent X/Y scale and rotation, then choose **Apply to path**. Scaling and rotation use the mean vertex position as the pivot; Bézier handle vectors receive the same linear transform. Values reset after application. These edits support Undo edit, Cancel, and keyed Mask Path updates at the chosen time.

**Copy path** stores the evaluated shape in Flowr's session clipboard. **Paste path** replaces only the current draft's shape; the existing topology rule applies to animated paths. **Paste path as new mask** appends a fresh mask using the chosen New mask mode. It copies geometry in layer pixels, not effects, feather settings or animation tracks. The clipboard lasts for the current app session and can be used across layers.

Enable **Link Feather X / Y** to drive both axes from Feather X, including its animation. Editing either linked value updates X. The timeline exposes a single feather track while linked. Unlinking restores the stored independent Y track.

## Controls

| Control | Behavior |
| --- | --- |
| Add | Alpha union with preceding masks |
| Subtract | Removes the current mask region |
| Intersect | Retains the overlap |
| Difference | Keeps non-overlapping alpha |
| Lighten / Darken | Maximum / minimum alpha |
| None or eye off | Ignores that mask |
| Inverted | Reverses inside and outside before applying opacity |
| Opacity | 0–100%; keyframable |
| Feather X / Y | 0–500 layer pixels on each local axis; keyframable |
| Expansion | −500 to +500 layer pixels; keyframable |
| Duplicate / ↑ / ↓ | Copies geometry and keys, or changes mask order |

A first Subtract, Intersect or Darken mask starts with the whole layer; a first Add, Difference or Lighten mask starts empty. All disabled/None masks leave the layer unchanged. Inversion affects the mask, not the source media. Masks cannot reveal pixels outside the source image itself.

## Animate the cutout

Turn on **Animate Path** to capture the first shape at the playhead. Move the editor's Time slider to another time, edit vertices/handles and choose Done; Flowr adds or updates a shape keyframe there. Existing keys retain their geometry. Animated paths keep the same vertex count and ordering; turn off Animate Path to freeze the evaluated shape before changing topology.

The layer's timeline has a **Masks** group with Mask Path, Opacity, Feather X/Y and Expansion tracks. Shape keys can be moved/deleted in the normal timeline; the Path diamond adds/removes a key at the current time. Numeric keys use the existing graph editor. Morphing interpolates corresponding vertices and handles with cubic easing; hold keys retain their shape until the next key. Animation is manual: moving subjects need additional shape keys.

## Rendering and persistence

Masks use the layer's coordinates and follow position, rotation, scale, flips, anchor and parent transforms. Local feather axes rotate/scale with the layer. The mask raster runs before layer effects, so a Glow can extend outside the masked edge. Layer opacity and blend mode apply afterward. Motion-blur samples evaluate animated masks at each sample time. Video masks operate on decoded frames. Precomp masks combine with masks on their children. Adjustment-layer masks restrict the adjusted region while preserving the original outside it.

Draft geometry is visible only in the editor preview. Exports use committed paths. Transparent PNG export retains cutout alpha; video formats use the app's existing opaque video background. Save/reopen, backups, duplicate and Undo/Redo retain geometry and keys.

## Practical limits

Up to 32 masks per layer and 512 vertices per mask. Feather uses three separable box passes to approximate Gaussian softness; expansion uses a Euclidean distance transform. This is an original Canvas implementation and does not promise pixel-identical After Effects edges or feature parity.

Static raster masks are cached. Preview raster work normally caps its longest side at 960 pixels, increasing with editor zoom. Exports use composition resolution; per-mask intermediate rasters are capped at 32 million samples (8 million in preview) to bound memory in extreme transforms. Complex animated masks, very large feather values and high-resolution exports cost more rendering time. Browser tests do not substitute for physical Android performance testing.

## Validation

Run `node tests/check-layer-masks.cjs`, `node tests/check-layer-mask-ui.cjs`, `node tests/check-layer-mask-integration.cjs` `node tests/check-layer-mask-precision.cjs` and `node tests/check-advanced-multi-masks.cjs` with Playwright installed. The integration test includes a tiny generated video fixture. The test scripts currently default to `/tmp/flowr-chromium`; set the executable path for your environment.
