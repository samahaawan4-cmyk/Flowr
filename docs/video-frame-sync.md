# Video cutout synchronization

Before v0.45 the timeline could advance a matte or tracked path while an HTML video element was still presenting the preceding source frame. Small seeks sometimes made the cutout appear correct again. The same realtime renderer supplied video export, so its mismatched frames could be recorded.

`video-frames.js` now keeps a source canvas snapshot paired with its presented media time. Roto sampling and generated tracked mask paths use that source time. Composition/layer transforms and manually animated mask properties retain timeline timing. Frame callbacks refresh the preview after decoding, and rapid seek requests coalesce without replacing an in-flight seek. While waiting, the renderer retains the last complete pixel/matte pair. It does not flash a new mask over old source pixels.

PNG and video export prepare visible source videos before their first frame. During playback/export, each source frame and its tracked cutout remain paired independently of the timeline clock. A stale queued seek no longer drags playback back toward an earlier target, and export does not run an additional old playback tick. Existing realtime encoding can still repeat/drop output frames on a slow device; this change does not introduce an offline encoder.

## Refresh an existing project

- **Roto Brush:** open Edit Rotoscope Brush, then Freeze & Apply. Old sample times are decoded once and converted to actual source-frame timestamps, with duplicate source samples removed. The saved alpha and brush marks are retained; no rebrushing or segmentation is needed. New analysis stores decoded timestamps automatically. Refresh may take a short time for a long span and can be canceled without applying a draft.
- **Auto Track Mask:** run Analyze and Apply again. New path keys use decoded source-frame times and retain editable native paths. The drawer identifies old tracking results that lack the new timing marker.
- **Manual masks/text/stills:** no timing refresh is required.

Source timestamps are preferred from `requestVideoFrameCallback`. Browsers without it use a frame-grid fallback based on observed playback cadence or composition rate. Frame-accurate behavior on unusual codecs/browser versions still requires device testing. Physical Android performance and codec-specific limitations remain unverified.

## Verification

`tests/check-video-frame-sync.cjs` uses a 15fps video with a moving red subject on a green background in a 30fps composition. A negative control reproduces the old mismatch. The corrected path checks immediate/settled seeks, non-frame-aligned times, rapid retargeting, advancing playback with bounded seek counts, and both roto and tracked native paths. It records actual video, decodes it independently, and checks that the moving subject advances without green background leaking through its mask. Editor guides are excluded from pixel checks.

`tests/check-roto-timing-upgrade.cjs` checks refresh of older 30fps-requested samples from a 15fps source, duplicate removal without resegmentation, and the corresponding reopened Roto workspace and final render. Existing save/reopen, propagation, alpha, nested composition and browser audio-export tests remain available.
