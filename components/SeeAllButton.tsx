import RightOrangeArrowIcon from "./RightOrangeArrowIcon";

export default function SeeAllButton({onclick}) {
  return (
    <button className="flex gap-[14px] w-[91px] h-[26px]" onClick={onclick}>
      <span className="text-[#F29145] font-medium">See All</span>
      <RightOrangeArrowIcon/>
    </button>
  );
}

