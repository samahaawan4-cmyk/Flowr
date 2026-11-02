# Text Animation presets — 0.36

Open the P tab at the left edge of the preview → Text Animation. This is the only category. It contains 92 editable native animations: 40 In, 32 Out and 20 Loop, plus eight existing appearance/effect shortcuts. In, Out, Loop and All tabs filter direction; every card is labelled. There are no extra category or grouping menus. Preview plays one animated thumbnail at a time; closing the drawer stops it. Existing text/font/style is retained. New layers use a sample appropriate to the grouping.

In and Loop begin at the playhead. Out is anchored to the layer end. In/Out durations fit within 40% of the layer by default, leaving a visible middle. Later groups remain neutral before their own start. Properties use native animator keyframes. Expand the timeline layer → Text → preset group to edit values and keys. Range Selector → Advanced exposes grouping, stagger/phase, order, loop enablement and loop duration. Manual animator groups and earlier library presets are kept. Every application adds an independent group, including repeated uses of the same preset. Undo/Redo and saving retain the data.

Loop presets cycle the property tracks across the layer. Words & Lines includes two additional grouped loops. Color presets animate Fill Amount; their color remains editable. Timeline values describe the first character/group; stagger offsets the other groups.

The removed fontpack-4e2d2f92b6d6.ttf (FTY STRATEGYCIDE NCV) is absent from the binary files, 2D browser, 3D font manifest and generated payloads. Older text using its ID falls back to system-ui in 2D or Sans Bold in 3D. There are 250 remaining bundled fonts.

| Preset | Direction | Grouping | Default duration |
| --- | --- | --- | --- |
| Fade Cascade | in | chars | 1.6 s |
| Typewriter | in | chars | 1.6 s |
| Soft Rise | in | chars | 1.6 s |
| Soft Drop | in | chars | 1.6 s |
| Slide From Left | in | chars | 1.6 s |
| Slide From Right | in | chars | 1.6 s |
| Diagonal Float | in | chars | 1.6 s |
| Zoom From Small | in | chars | 1.6 s |
| Zoom Overshoot | in | chars | 1.6 s |
| Rubber Pop | in | chars | 1.6 s |
| Clockwise Settle | in | chars | 1.6 s |
| Counterclockwise Settle | in | chars | 1.6 s |
| Spiral In | in | chars | 1.6 s |
| Tumble Up | in | chars | 1.6 s |
| Focus Reveal | in | chars | 1.6 s |
| Tracking Expand | in | chars | 1.6 s |
| Tracking Contract | in | chars | 1.6 s |
| Center Bloom | in | chars | 1.6 s |
| Edge Gather | in | chars | 1.6 s |
| Random Assemble | in | chars | 1.6 s |
| Elastic Rise | in | chars | 1.9 s |
| Whip Right | in | chars | 1.1 s |
| Focus Pop | in | chars | 1.6 s |
| Letter Roll | in | chars | 1.9 s |
| Fade Cascade Out | out | chars | 1.6 s |
| Rise Out | out | chars | 1.6 s |
| Drop Out | out | chars | 1.6 s |
| Slide Left Out | out | chars | 1.6 s |
| Slide Right Out | out | chars | 1.6 s |
| Zoom Away | out | chars | 1.6 s |
| Punch Out | out | chars | 1.6 s |
| Blur Dissolve | out | chars | 1.6 s |
| Tracking Scatter | out | chars | 1.6 s |
| Spin Out | out | chars | 1.6 s |
| Random Vanish | out | chars | 1.6 s |
| Center Collapse | out | chars | 1.6 s |
| Sine Wave | loop | chars | 2 s |
| Scale Ripple | loop | chars | 1.6 s |
| Pendulum | loop | chars | 2 s |
| Letter Orbit | loop | chars | 2.4 s |
| Breathing | loop | chars | 2.4 s |
| Tracking Pulse | loop | chars | 2 s |
| Cyan Shimmer | loop | chars | 2.2 s |
| Neon Flicker | loop | chars | 1.8 s |
| Violet Sweep | loop | chars | 2.2 s |
| Blur Pulse | loop | chars | 2 s |
| Spring Bounce | loop | chars | 1.8 s |
| Letter Dance | loop | chars | 1.6 s |
| Heartbeat | loop | chars | 1.5 s |
| Electric Jitter | loop | chars | 0.65 s |
| Elliptic Float | loop | chars | 2.6 s |
| Soft Blink | loop | chars | 2.2 s |
| Word Rise | in | words | 1.6 s |
| Word Slide | in | words | 1.6 s |
| Word Pop | in | words | 1.6 s |
| Word Spin | in | words | 1.6 s |
| Word Focus | in | words | 1.6 s |
| Word Cascade Out | out | words | 1.6 s |
| Line Rise | in | lines | 1.6 s |
| Line Slide | in | lines | 1.6 s |
| Line Fade | in | lines | 2 s |
| Line Tilt | in | lines | 1.6 s |
| Line Wave | loop | lines | 2.2 s |
| Line Scale Pulse | loop | lines | 2.4 s |
| Elastic Drop Out | out | chars | 1.6 s |
| Tumble Down Out | out | chars | 1.6 s |
| Focus Punch Out | out | chars | 1.6 s |
| Edges Shrink Out | out | chars | 1.6 s |
| Random Scatter Out | out | chars | 1.6 s |
| Whip Left Out | out | chars | 1.1 s |
| Whip Right Out | out | chars | 1.1 s |
| Rolling Exit | out | chars | 1.8 s |
| Defocus Away | out | chars | 1.6 s |
| Tracking Close Out | out | chars | 1.6 s |
| Diagonal Exit | out | chars | 1.6 s |
| Word Drop Out | out | words | 1.6 s |
| Kinetic Stack In | in | words | 2 s |
| Editorial Tracking In | in | chars | 2 s |
| Domino Type In | in | chars | 1.9 s |
| Rubber Stamp In | in | words | 1.8 s |
| Ribbon Lines In | in | lines | 2.2 s |
| Magnet Type In | in | chars | 2 s |
| Cinema Title In | in | chars | 2.6 s |
| Kinetic Stack Out | out | words | 2 s |
| Editorial Tracking Out | out | chars | 2 s |
| Domino Type Out | out | chars | 1.9 s |
| Rubber Stamp Out | out | words | 1.8 s |
| Ribbon Lines Out | out | lines | 2.2 s |
| Magnet Type Out | out | chars | 2 s |
| Cinema Title Out | out | chars | 2.6 s |
| Kinetic Conveyor | loop | words | 3 s |
| Accordion Type | loop | chars | 3.2 s |

Validation covers changing native renders for all 92 presets, matching loop frames a cycle apart, drawer filtering and animated preview controls, preserved text and manual animator groups, stacking presets, Undo/Redo, save/reopen, removed-font fallback and the 250-font library. Physical Android testing remains outstanding.

Regenerate thumbnails with node scripts/build-advanced-text-previews.cjs (Playwright/Chromium and Pillow required). The previews are actual rendered frames.

## Combining presets (0.34)

Apply two or more presets to the selected text layer. Each appears as its own named group under Timeline → Text; repeated uses are numbered. Their properties combine using the native animator rules (position/rotation/tracking add, scale/opacity multiply, and color groups blend in order). Disable a group with its eye control or remove it with ×; other groups and keys remain.

In keys begin at the playhead; Out keys are placed near the layer end automatically. Combine In + Loop + Out on the same layer. Fade In and Rise In from Motion also create separate text groups. Neon Title and Outline Title can be combined in either order. Clean Title deliberately resets appearance settings while retaining animator groups.

## Motion curves

Multi-key motion uses continuous monotone tangents through intermediate values, zero speed at direction changes and matching periodic tangents at loop seams. Two-key motion uses cubic easing (0.22, 0, 0.18, 1). Existing generated default curves upgrade automatically; hand-edited handles and deliberate hold keys are retained. These are native editable animations.
