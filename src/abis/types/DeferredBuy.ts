/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PayableOverrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import type {
  FunctionFragment,
  Result,
  EventFragment,
} from "@ethersproject/abi";
import type { Listener, Provider } from "@ethersproject/providers";
import type {
  TypedEventFilter,
  TypedEvent,
  TypedListener,
  OnEvent,
  PromiseOrValue,
} from "./common";

export declare namespace DeferredBuy {
  export type OfferStruct = {
    nftAddress: PromiseOrValue<string>;
    availableAt: PromiseOrValue<BigNumberish>;
    maxClaims: PromiseOrValue<BigNumberish>;
    offerPrice: PromiseOrValue<BigNumberish>;
  };

  export type OfferStructOutput = [string, number, number, BigNumber] & {
    nftAddress: string;
    availableAt: number;
    maxClaims: number;
    offerPrice: BigNumber;
  };
}

export interface DeferredBuyInterface extends utils.Interface {
  functions: {
    "CLAIM_TIMEOUT()": FunctionFragment;
    "Offers(uint256)": FunctionFragment;
    "OffersLength()": FunctionFragment;
    "claimOffer(uint256,uint256)": FunctionFragment;
    "claimOfferMultiple(uint256,uint256[])": FunctionFragment;
    "claimedOffers(uint256)": FunctionFragment;
    "getAllOffers()": FunctionFragment;
    "makeAnOffer(address,uint256,uint256)": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
    "withdraw(uint256)": FunctionFragment;
  };

  getFunction(
    nameOrSignatureOrTopic:
      | "CLAIM_TIMEOUT"
      | "Offers"
      | "OffersLength"
      | "claimOffer"
      | "claimOfferMultiple"
      | "claimedOffers"
      | "getAllOffers"
      | "makeAnOffer"
      | "owner"
      | "renounceOwnership"
      | "transferOwnership"
      | "withdraw"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "CLAIM_TIMEOUT",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "Offers",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "OffersLength",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "claimOffer",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "claimOfferMultiple",
    values: [PromiseOrValue<BigNumberish>, PromiseOrValue<BigNumberish>[]]
  ): string;
  encodeFunctionData(
    functionFragment: "claimedOffers",
    values: [PromiseOrValue<BigNumberish>]
  ): string;
  encodeFunctionData(
    functionFragment: "getAllOffers",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "makeAnOffer",
    values: [
      PromiseOrValue<string>,
      PromiseOrValue<BigNumberish>,
      PromiseOrValue<BigNumberish>
    ]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [PromiseOrValue<string>]
  ): string;
  encodeFunctionData(
    functionFragment: "withdraw",
    values: [PromiseOrValue<BigNumberish>]
  ): string;

  decodeFunctionResult(
    functionFragment: "CLAIM_TIMEOUT",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "Offers", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "OffersLength",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "claimOffer", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "claimOfferMultiple",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "claimedOffers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAllOffers",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "makeAnOffer",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;

  events: {
    "Claim(address,address,uint256,uint256)": EventFragment;
    "Deposit(address,uint256,uint256,uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Withdraw(uint256,uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Claim"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Deposit"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Withdraw"): EventFragment;
}

export interface ClaimEventObject {
  claimer: string;
  nftAddress: string;
  tokenId: BigNumber;
  offerValue: BigNumber;
}
export type ClaimEvent = TypedEvent<
  [string, string, BigNumber, BigNumber],
  ClaimEventObject
>;

export type ClaimEventFilter = TypedEventFilter<ClaimEvent>;

export interface DepositEventObject {
  nftAddress: string;
  availableAt: BigNumber;
  claims: BigNumber;
  offerPrice: BigNumber;
}
export type DepositEvent = TypedEvent<
  [string, BigNumber, BigNumber, BigNumber],
  DepositEventObject
>;

export type DepositEventFilter = TypedEventFilter<DepositEvent>;

export interface OwnershipTransferredEventObject {
  previousOwner: string;
  newOwner: string;
}
export type OwnershipTransferredEvent = TypedEvent<
  [string, string],
  OwnershipTransferredEventObject
>;

export type OwnershipTransferredEventFilter =
  TypedEventFilter<OwnershipTransferredEvent>;

export interface WithdrawEventObject {
  offerId: BigNumber;
  Timestamp: BigNumber;
}
export type WithdrawEvent = TypedEvent<
  [BigNumber, BigNumber],
  WithdrawEventObject
>;

export type WithdrawEventFilter = TypedEventFilter<WithdrawEvent>;

export interface DeferredBuy extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: DeferredBuyInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    CLAIM_TIMEOUT(overrides?: CallOverrides): Promise<[BigNumber]>;

    Offers(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, number, number, BigNumber] & {
        nftAddress: string;
        availableAt: number;
        maxClaims: number;
        offerPrice: BigNumber;
      }
    >;

    OffersLength(overrides?: CallOverrides): Promise<[BigNumber]>;

    claimOffer(
      offerId: PromiseOrValue<BigNumberish>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    claimOfferMultiple(
      offerId: PromiseOrValue<BigNumberish>,
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    claimedOffers(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    getAllOffers(
      overrides?: CallOverrides
    ): Promise<[DeferredBuy.OfferStructOutput[]]>;

    makeAnOffer(
      nftAddress: PromiseOrValue<string>,
      availableAt: PromiseOrValue<BigNumberish>,
      maxClaims: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;

    withdraw(
      offerId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<ContractTransaction>;
  };

  CLAIM_TIMEOUT(overrides?: CallOverrides): Promise<BigNumber>;

  Offers(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<
    [string, number, number, BigNumber] & {
      nftAddress: string;
      availableAt: number;
      maxClaims: number;
      offerPrice: BigNumber;
    }
  >;

  OffersLength(overrides?: CallOverrides): Promise<BigNumber>;

  claimOffer(
    offerId: PromiseOrValue<BigNumberish>,
    tokenId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  claimOfferMultiple(
    offerId: PromiseOrValue<BigNumberish>,
    tokenIds: PromiseOrValue<BigNumberish>[],
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  claimedOffers(
    arg0: PromiseOrValue<BigNumberish>,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  getAllOffers(
    overrides?: CallOverrides
  ): Promise<DeferredBuy.OfferStructOutput[]>;

  makeAnOffer(
    nftAddress: PromiseOrValue<string>,
    availableAt: PromiseOrValue<BigNumberish>,
    maxClaims: PromiseOrValue<BigNumberish>,
    overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  withdraw(
    offerId: PromiseOrValue<BigNumberish>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    CLAIM_TIMEOUT(overrides?: CallOverrides): Promise<BigNumber>;

    Offers(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<
      [string, number, number, BigNumber] & {
        nftAddress: string;
        availableAt: number;
        maxClaims: number;
        offerPrice: BigNumber;
      }
    >;

    OffersLength(overrides?: CallOverrides): Promise<BigNumber>;

    claimOffer(
      offerId: PromiseOrValue<BigNumberish>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    claimOfferMultiple(
      offerId: PromiseOrValue<BigNumberish>,
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: CallOverrides
    ): Promise<void>;

    claimedOffers(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAllOffers(
      overrides?: CallOverrides
    ): Promise<DeferredBuy.OfferStructOutput[]>;

    makeAnOffer(
      nftAddress: PromiseOrValue<string>,
      availableAt: PromiseOrValue<BigNumberish>,
      maxClaims: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: CallOverrides
    ): Promise<void>;

    withdraw(
      offerId: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Claim(address,address,uint256,uint256)"(
      claimer?: PromiseOrValue<string> | null,
      nftAddress?: PromiseOrValue<string> | null,
      tokenId?: null,
      offerValue?: null
    ): ClaimEventFilter;
    Claim(
      claimer?: PromiseOrValue<string> | null,
      nftAddress?: PromiseOrValue<string> | null,
      tokenId?: null,
      offerValue?: null
    ): ClaimEventFilter;

    "Deposit(address,uint256,uint256,uint256)"(
      nftAddress?: PromiseOrValue<string> | null,
      availableAt?: null,
      claims?: null,
      offerPrice?: null
    ): DepositEventFilter;
    Deposit(
      nftAddress?: PromiseOrValue<string> | null,
      availableAt?: null,
      claims?: null,
      offerPrice?: null
    ): DepositEventFilter;

    "OwnershipTransferred(address,address)"(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;
    OwnershipTransferred(
      previousOwner?: PromiseOrValue<string> | null,
      newOwner?: PromiseOrValue<string> | null
    ): OwnershipTransferredEventFilter;

    "Withdraw(uint256,uint256)"(
      offerId?: null,
      Timestamp?: null
    ): WithdrawEventFilter;
    Withdraw(offerId?: null, Timestamp?: null): WithdrawEventFilter;
  };

  estimateGas: {
    CLAIM_TIMEOUT(overrides?: CallOverrides): Promise<BigNumber>;

    Offers(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    OffersLength(overrides?: CallOverrides): Promise<BigNumber>;

    claimOffer(
      offerId: PromiseOrValue<BigNumberish>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    claimOfferMultiple(
      offerId: PromiseOrValue<BigNumberish>,
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    claimedOffers(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    getAllOffers(overrides?: CallOverrides): Promise<BigNumber>;

    makeAnOffer(
      nftAddress: PromiseOrValue<string>,
      availableAt: PromiseOrValue<BigNumberish>,
      maxClaims: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;

    withdraw(
      offerId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    CLAIM_TIMEOUT(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    Offers(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    OffersLength(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    claimOffer(
      offerId: PromiseOrValue<BigNumberish>,
      tokenId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    claimOfferMultiple(
      offerId: PromiseOrValue<BigNumberish>,
      tokenIds: PromiseOrValue<BigNumberish>[],
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    claimedOffers(
      arg0: PromiseOrValue<BigNumberish>,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    getAllOffers(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    makeAnOffer(
      nftAddress: PromiseOrValue<string>,
      availableAt: PromiseOrValue<BigNumberish>,
      maxClaims: PromiseOrValue<BigNumberish>,
      overrides?: PayableOverrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: PromiseOrValue<string>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;

    withdraw(
      offerId: PromiseOrValue<BigNumberish>,
      overrides?: Overrides & { from?: PromiseOrValue<string> }
    ): Promise<PopulatedTransaction>;
  };
}
