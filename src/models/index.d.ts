import { ModelInit, MutableModel, __modelMeta__, OptionallyManagedIdentifier, CustomIdentifier } from "@aws-amplify/datastore";
// @ts-expect-error This is needed because the library has incorrect types.
import { LazyLoading, LazyLoadingDisabled, AsyncCollection, AsyncItem } from "@aws-amplify/datastore";





type EagerUserProfile = {
  readonly [__modelMeta__]: {
    identifier: OptionallyManagedIdentifier<UserProfile, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userIdAMP: string;
  readonly riderLevel?: string | null;
  readonly bikesOwned?: (Bike | null)[] | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyUserProfile = {
  readonly [__modelMeta__]: {
    identifier: OptionallyManagedIdentifier<UserProfile, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly userIdAMP: string;
  readonly riderLevel?: string | null;
  readonly bikesOwned: AsyncCollection<Bike>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type UserProfile = LazyLoading extends LazyLoadingDisabled ? EagerUserProfile : LazyUserProfile

export declare const UserProfile: (new (init: ModelInit<UserProfile>) => UserProfile) & {
  copyOf(source: UserProfile, mutator: (draft: MutableModel<UserProfile>) => MutableModel<UserProfile> | void): UserProfile;
}

type EagerBike = {
  readonly [__modelMeta__]: {
    identifier: OptionallyManagedIdentifier<Bike, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly bikeNumber: number;
  readonly brand: string;
  readonly model: string;
  readonly year?: number | null;
  readonly sold?: boolean | null;
  readonly broken?: boolean | null;
  readonly ownershipMonths?: number | null;
  readonly score?: number | null;
  readonly userId: string;
  readonly owner?: UserProfile | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazyBike = {
  readonly [__modelMeta__]: {
    identifier: OptionallyManagedIdentifier<Bike, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly bikeNumber: number;
  readonly brand: string;
  readonly model: string;
  readonly year?: number | null;
  readonly sold?: boolean | null;
  readonly broken?: boolean | null;
  readonly ownershipMonths?: number | null;
  readonly score?: number | null;
  readonly userId: string;
  readonly owner: AsyncItem<UserProfile | undefined>;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type Bike = LazyLoading extends LazyLoadingDisabled ? EagerBike : LazyBike

export declare const Bike: (new (init: ModelInit<Bike>) => Bike) & {
  copyOf(source: Bike, mutator: (draft: MutableModel<Bike>) => MutableModel<Bike> | void): Bike;
}

type EagerbrandStats = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<brandStats, 'brandName'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly brandName: string;
  readonly avgSatisScore?: number | null;
  readonly totalNumBikes?: number | null;
  readonly numFirstBike?: number | null;
  readonly numSecondBike?: number | null;
  readonly numThirdPlusBike?: number | null;
  readonly numBroken?: number | null;
  readonly numSold?: number | null;
  readonly avgOwnership?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazybrandStats = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<brandStats, 'brandName'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly brandName: string;
  readonly avgSatisScore?: number | null;
  readonly totalNumBikes?: number | null;
  readonly numFirstBike?: number | null;
  readonly numSecondBike?: number | null;
  readonly numThirdPlusBike?: number | null;
  readonly numBroken?: number | null;
  readonly numSold?: number | null;
  readonly avgOwnership?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type brandStats = LazyLoading extends LazyLoadingDisabled ? EagerbrandStats : LazybrandStats

export declare const brandStats: (new (init: ModelInit<brandStats>) => brandStats) & {
  copyOf(source: brandStats, mutator: (draft: MutableModel<brandStats>) => MutableModel<brandStats> | void): brandStats;
}

type EagermakeStats = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<makeStats, 'modelName'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly modelName: string;
  readonly brandName: string;
  readonly avgSatisScore?: number | null;
  readonly totalNumBikes?: number | null;
  readonly numFirstBike?: number | null;
  readonly numSecondBike?: number | null;
  readonly numThirdPlusBike?: number | null;
  readonly numBroken?: number | null;
  readonly numSold?: number | null;
  readonly avgOwnership?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazymakeStats = {
  readonly [__modelMeta__]: {
    identifier: CustomIdentifier<makeStats, 'modelName'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly modelName: string;
  readonly brandName: string;
  readonly avgSatisScore?: number | null;
  readonly totalNumBikes?: number | null;
  readonly numFirstBike?: number | null;
  readonly numSecondBike?: number | null;
  readonly numThirdPlusBike?: number | null;
  readonly numBroken?: number | null;
  readonly numSold?: number | null;
  readonly avgOwnership?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type makeStats = LazyLoading extends LazyLoadingDisabled ? EagermakeStats : LazymakeStats

export declare const makeStats: (new (init: ModelInit<makeStats>) => makeStats) & {
  copyOf(source: makeStats, mutator: (draft: MutableModel<makeStats>) => MutableModel<makeStats> | void): makeStats;
}

type EagerbikeStats = {
  readonly [__modelMeta__]: {
    identifier: OptionallyManagedIdentifier<bikeStats, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly modelName: string;
  readonly bikeYear: number;
  readonly bikeNum?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazybikeStats = {
  readonly [__modelMeta__]: {
    identifier: OptionallyManagedIdentifier<bikeStats, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly modelName: string;
  readonly bikeYear: number;
  readonly bikeNum?: number | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type bikeStats = LazyLoading extends LazyLoadingDisabled ? EagerbikeStats : LazybikeStats

export declare const bikeStats: (new (init: ModelInit<bikeStats>) => bikeStats) & {
  copyOf(source: bikeStats, mutator: (draft: MutableModel<bikeStats>) => MutableModel<bikeStats> | void): bikeStats;
}

type EagertotalStats = {
  readonly [__modelMeta__]: {
    identifier: OptionallyManagedIdentifier<totalStats, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly totalNumBikes: number;
  readonly totalNumBroken: number;
  readonly totalNumSold: number;
  readonly totalNumFirst: number;
  readonly totalNumSecond: number;
  readonly totalNumThird: number;
  readonly totalAvgOwnerShip: number;
  readonly totalAvgSatisScore: number;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

type LazytotalStats = {
  readonly [__modelMeta__]: {
    identifier: OptionallyManagedIdentifier<totalStats, 'id'>;
    readOnlyFields: 'createdAt' | 'updatedAt';
  };
  readonly id: string;
  readonly totalNumBikes: number;
  readonly totalNumBroken: number;
  readonly totalNumSold: number;
  readonly totalNumFirst: number;
  readonly totalNumSecond: number;
  readonly totalNumThird: number;
  readonly totalAvgOwnerShip: number;
  readonly totalAvgSatisScore: number;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
}

export declare type totalStats = LazyLoading extends LazyLoadingDisabled ? EagertotalStats : LazytotalStats

export declare const totalStats: (new (init: ModelInit<totalStats>) => totalStats) & {
  copyOf(source: totalStats, mutator: (draft: MutableModel<totalStats>) => MutableModel<totalStats> | void): totalStats;
}