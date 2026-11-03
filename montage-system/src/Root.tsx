import React from "react";
import { Composition, Folder } from "remotion";
import { VIDEO } from "./system/safeArea";
import { Reel } from "./system/Reel";
import { calculateReelMetadata } from "./system/calculateMetadata";
import { videos } from "./videos";
import * as Ex from "./examples/Examples";
import "./theme/fonts";

const common = { width: VIDEO.width, height: VIDEO.height, fps: VIDEO.fps } as const;

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="Videos">
      {videos.map((spec) => (
        <Composition
          key={spec.id}
          id={spec.id}
          component={Reel}
          {...common}
          durationInFrames={30 * VIDEO.fps}
          defaultProps={{ spec }}
          calculateMetadata={calculateReelMetadata}
        />
      ))}
    </Folder>
    <Folder name="Examples">
      <Composition id="Ex-TextReveal" component={Ex.TextRevealExample} {...common} durationInFrames={120} />
      <Composition id="Ex-Icons" component={Ex.IconsExample} {...common} durationInFrames={90} />
      <Composition id="Ex-StaggerList" component={Ex.StaggerListExample} {...common} durationInFrames={120} />
      <Composition id="Ex-LowerThird" component={Ex.LowerThirdExample} {...common} durationInFrames={90} />
      <Composition id="Ex-CTA" component={Ex.CTAExample} {...common} durationInFrames={120} />
      <Composition id="Ex-SafeZone" component={Ex.SafeZoneExample} {...common} durationInFrames={90} />
    </Folder>
  </>
);
