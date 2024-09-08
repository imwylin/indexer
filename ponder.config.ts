import { createConfig } from "@ponder/core";
import { http } from "viem";

import { NounsAuctionHouseAbi } from "./abis/NounsAuctionHouseAbi";
import { NounsAuctionHouseV2Abi } from "./abis/NounsAuctionHouseV2Abi";
import { NounsTokenAbi } from "./abis/NounsTokenAbi";
import { NounsDAOAbi } from "./abis/NounsDAOAbi";
import { NounsDAOV4Abi } from "./abis/NounsDAOV4Abi";
import { NounsDAODataAbi } from "./abis/NounsDAODataAbi";

export default createConfig({
  networks: {
    mainnet: { chainId: 1, transport: http(process.env.PONDER_RPC_URL_1) },
  },
  contracts: {
    NounsAuctionHouse: {
      network: "mainnet",
      address: "0x830BD73E4184ceF73443C15111a1DF14e495C706",
      abi: NounsAuctionHouseAbi,
      startBlock: 12985451,
    },
    NounsAuctionHouseV2: {
      network: "mainnet",
      address: "0x830BD73E4184ceF73443C15111a1DF14e495C706",
      abi: NounsAuctionHouseV2Abi,
      startBlock: 12985451,
    },
    NounsToken: {
      network: "mainnet",
      address: "0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03",
      abi: NounsTokenAbi,
      startBlock: 12985438,
    },
    NounsDAO: {
      network: "mainnet",
      address: "0x6f3E6272A167e8AcCb32072d08E0957F9c79223d",
      abi: NounsDAOAbi,
      startBlock: 12985453,
    },
    NounsDAOV4: {
      network: "mainnet",
      address: "0x6f3E6272A167e8AcCb32072d08E0957F9c79223d",
      abi: NounsDAOV4Abi,
      startBlock: 12985453,
    },
    NounsDAOData: {
      network: "mainnet",
      address: "0xf790A5f59678dd733fb3De93493A91f472ca1365",
      abi: NounsDAODataAbi,
      startBlock: 17812145,
    },
  },
});
