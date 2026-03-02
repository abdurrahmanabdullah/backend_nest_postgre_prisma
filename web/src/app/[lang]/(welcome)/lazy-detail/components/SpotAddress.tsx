import ActionButton from "@/app/[lang]/(welcome)/lazy-detail/components/ActionButton";

export default function SpotAddress() {
    return (
        <div className=" pl-[15px] mt-[15px] relative">
           <div className=" flex gap-2 flex-wrap w-10/12">
           <span className="flex text-[12px] gap-1  bg-[#ACABAB] py-1 px-2 rounded-full">
                <img src="/images/lazy-detail/locationImage.png" alt="" />
                Niigata Prefecture
            </span>
            <span className="flex text-[12px] gap-1 bg-[#ACABAB] py-1 px-4 rounded-full">
                Roadside station
            </span>
            <span className="flex text-[12px] gap-1 bg-[#ACABAB] py-1 px-4 rounded-full">
                Roadside station
            </span>
            <span className="flex text-[12px] gap-1 bg-[#ACABAB] py-1 px-4 rounded-full">
                Roadside station
            </span>
           </div>

           <ActionButton/>
        </div>
    )
}
