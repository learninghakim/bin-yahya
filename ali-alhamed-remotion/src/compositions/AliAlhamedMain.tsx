// Main composition — layer stack, bottom → top:
// 1 DotGrid background (visible around framed / band layouts)
// 2 Presenter: ONE continuous source video (+ original audio), re-framed only
// 3 Scene graphics (A overlays, B panels, C full-screen motion graphics)
// 4/5 Finish: gentle grade + grain + vignette
// + SFX track (low, under dialogue)
import React from "react";
import { AbsoluteFill } from "remotion";
import { SCENES } from "../data/timing";
import { DotGrid } from "../components/DotGrid";
import { Presenter } from "../components/Presenter";
import { Finish, SfxTrack, Window } from "../components/Stage";
import { FinancialProfile } from "../scenes/FinancialProfile";
import { BiggerDecisions } from "../scenes/BiggerDecisions";
import { DubaiApartment, MonthlyEquation, RentRange } from "../scenes/DubaiRent";
import { BuyChip, FinanceAdvice, Landlord, TenYears } from "../scenes/TenYearEquation";
import { CostStack, RealityCheck, StopAgain, StopInterrupt } from "../scenes/StopAndCosts";
import { BuyVsRentSplit, KeyIdea, NotOnlyPrice } from "../scenes/BuyVsRent";
import { JournalCard, OwnershipFeeling } from "../scenes/ResearchInsight";
import { BigDecision, ChapterFrame, TwentyYears } from "../scenes/DecisionChapter";
import { SevenQuestions } from "../scenes/SevenQuestions";
import { AliIntro, Outro } from "../scenes/AliIntro";

const S = SCENES;

export const AliAlhamedMain: React.FC = () => (
  <AbsoluteFill style={{ background: "#000" }}>
    <DotGrid glowX={0.3} glowY={0.5} glow={0.8} />
    <Presenter />

    {/* Scene 01–02 */}
    <Window {...S.s01FinancialProfile}><FinancialProfile /></Window>
    <Window {...S.s02BiggerDecisions}><BiggerDecisions /></Window>
    {/* Scene 03 */}
    <DubaiApartment />
    <Window {...S.s03RentRange}><RentRange /></Window>
    <MonthlyEquation />
    {/* Scene 04 */}
    <Landlord />
    <Window {...S.s04Finance}><FinanceAdvice /></Window>
    <TenYears />
    <Window {...S.s04BuyChip}><BuyChip /></Window>
    {/* Scene 05 — pattern interrupt + costs */}
    <StopInterrupt />
    <RealityCheck />
    <Window {...S.s05CostStack}><CostStack /></Window>
    <Window {...S.s05Stop2}><StopAgain /></Window>
    {/* Scene 06 */}
    <NotOnlyPrice />
    <Window {...S.s06BuyVsRent}><BuyVsRentSplit /></Window>
    <KeyIdea />
    {/* Scene 07 */}
    <Window {...S.s07Journal}><JournalCard /></Window>
    <OwnershipFeeling />
    {/* Scene 08 */}
    <ChapterFrame />
    <Window {...S.s08BigDecision}><BigDecision /></Window>
    <TwentyYears />
    {/* Scene 09 */}
    <SevenQuestions />
    {/* Scene 10–11 */}
    <Window {...S.s10AliIntro}><AliIntro /></Window>
    <Window {...S.s11Outro}><Outro /></Window>

    <Finish />
    <SfxTrack />
  </AbsoluteFill>
);
