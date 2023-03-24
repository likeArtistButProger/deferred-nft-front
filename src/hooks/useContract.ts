import { useMemo } from "react"
import { ethers } from "ethers"
import { useWeb3React } from "@web3-react/core"

function useContract<T = ethers.Contract>(address: string, abi: any) {
    const { account, library } = useWeb3React();

    return useMemo((): T => {
        // @ts-ignore
        return new ethers.Contract<T>(address, abi, !!account ? library.getSigner() : library);
    }, [account, library, address, abi]);
}

export { useContract }