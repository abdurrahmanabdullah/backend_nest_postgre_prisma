

type SpotDetailsProps = {
  des?: boolean;
  color?: string; 
  spot:any
};
const SpotDetails = ({ des = true, color = "black",spot }: SpotDetailsProps) => {

  return (
    <div className="text-black ml-[10px]">
      <div>
        <p className={`uppercase text-[15px] font-bold ${color==="white"?"text-white":""}`}>{spot?.name}</p>
      </div>
      <div className={`${des?"":"hidden"}`}>
        <p className="text-[10px] text-[#ACABAB]">
          Niigata : Bamboo forest / Roadside station
        </p>
      </div>
      <div className="flex gap-2 items-center">
        <div className="flex items-center justify-between gap-x-1">
          <img
            src="/images/sentiment_excited.png"
            alt="sentiment_excited"
            width={18}
            height={18}
          />
          <p className="text-[16px] font-bold text-[#2883E6]">1,000k</p>
        </div>
        <div className="flex items-center justify-between gap-x-1">
          <img
            src="/images/sentiment_neutral.png"
            alt="sentiment_excited"
            width={18}
            height={18}
          />
          <p className="text-[16px] font-bold text-[#F8835B]">1,000k</p>
        </div>
        <div className="flex items-center justify-between gap-x-1">
          <img
            src="/images/sentiment_stressed.png"
            alt="sentiment_excited"
            width={18}
            height={18}
          />
          <p className="text-[16px] font-bold text-[#F35D60]">1,000k</p>
        </div>
      </div>
    </div>
  );
};

export default SpotDetails;
