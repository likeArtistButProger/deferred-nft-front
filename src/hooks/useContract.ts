import { useMemo } from "react"
import { ethers } from "ethers"
import { useWeb3React } from "@web3-react/core"

const useContract = (address: string, abi: any) => {
    const { account, library } = useWeb3React();

    return useMemo(() => {
        return new ethers.Contract(address, abi, !!account ? library.getSigner() : library);
    }, [account, library, address, abi]);
}

export { useContract }