import { NextPage } from "next";

type PlaceHolderNftCardProps = {
  number?: number;
};

const PlaceHolderNftCard: NextPage<PlaceHolderNftCardProps> = ({ number = 4 }) => {
  return new Array(number).fill(0).map((_, y) => (
    <div key={y} className="card bg-base-100 flex-1 shadow-sm">
      <div className="relative h-60 w-full rounded-t-lg rounded-b-none skeleton" />
      <div className="card-body gap-3">
        <div className="skeleton h-8 w-full" />

        <div className="skeleton h-8 w-full" />
        <div className="skeleton h-8 w-full" />
      </div>
    </div>
  ));
};

export default PlaceHolderNftCard;
