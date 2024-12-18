import { ArrowRight, ArrowLeft } from "lucide-react";
import nftImage from "/banner1.jpg";

const NFTCard = () => (
  <div className="flex flex-col md:flex-row bg-blue-50 p-6 rounded-lg shadow">
    {/* Left Section */}
    <div className="w-full md:w-1/2 space-y-4">
      <h2 className="text-4xl font-bold">
        ALONE <span className="text-blue-600">MAN</span>
      </h2>
      <p className="text-gray-600">Design Illustration®</p>
      <p className="text-sm text-green-600">Sale ends April 6, 2022 at 5:00am</p>
      <button className="bg-blue-600 text-white px-6 py-3 rounded-full">
        Place a Bid
      </button>
      <p className="text-gray-400">View Item →</p>
    </div>

    {/* Right Section */}
    <div className="relative w-full md:w-1/2">
      <img src={nftImage} alt="NFT" className="w-full rounded-lg" />
      <div className="absolute bottom-0 bg-white p-4 rounded-lg w-full shadow">
        <div className="flex justify-between">
          <div>
            <p className="text-gray-400">Current Bid</p>
            <p className="font-bold">1.00 ETH</p>
          </div>
          <div>
            <p className="text-gray-400">Creator</p>
            <p className="font-bold">Enrico Cole</p>
          </div>
        </div>
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-2">
        <ArrowLeft className="cursor-pointer" />
        <ArrowRight className="cursor-pointer" />
      </div>
    </div>
  </div>
);

export default NFTCard;
