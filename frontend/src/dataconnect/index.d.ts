import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddFavoriteData {
  favorite_insert: Favorite_Key;
}

export interface AddFavoriteVariables {
  destinationId: string;
}

export interface Booking_Key {
  id: UUIDString;
  __typename?: 'Booking_Key';
}

export interface CancelBookingData {
  booking_update?: Booking_Key | null;
}

export interface CancelBookingVariables {
  id: UUIDString;
}

export interface CreateBookingData {
  booking_insert: Booking_Key;
}

export interface CreateBookingVariables {
  pnrNumber: string;
  mode: string;
  serviceName: string;
  origin: string;
  destination: string;
  travelDate: DateString;
  totalPrice: number;
}

export interface CreateReviewData {
  review_insert: Review_Key;
}

export interface CreateReviewVariables {
  destinationId: string;
  rating: number;
  comment: string;
  visitMonth?: string | null;
}

export interface CreateTripData {
  trip_insert: Trip_Key;
}

export interface CreateTripVariables {
  title: string;
  destination: string;
  days: number;
  budget?: number | null;
}

export interface DeleteTripData {
  trip_delete?: Trip_Key | null;
}

export interface DeleteTripVariables {
  id: UUIDString;
}

export interface Destination_Key {
  id: string;
  __typename?: 'Destination_Key';
}

export interface Favorite_Key {
  id: UUIDString;
  __typename?: 'Favorite_Key';
}

export interface GetDestinationByIdData {
  destination?: {
    id: string;
    name: string;
    state: string;
    district?: string | null;
    region?: string | null;
    category?: string | null;
    overview?: string | null;
    images: string[];
    rating?: number | null;
    reviewsCount?: number | null;
    crowdLevel?: string | null;
    viewpointStatus?: string | null;
    stayCost?: number | null;
    foodCost?: number | null;
    travelCost?: number | null;
    reviews: ({
      id: UUIDString;
      rating: number;
      comment: string;
      visitMonth?: string | null;
      createdAt: TimestampString;
      traveler: {
        name?: string | null;
        avatar?: string | null;
      };
    } & Review_Key)[];
  } & Destination_Key;
}

export interface GetDestinationByIdVariables {
  id: string;
}

export interface GetMyBookingsData {
  bookings: ({
    id: UUIDString;
    pnrNumber: string;
    mode: string;
    serviceName: string;
    origin: string;
    destination: string;
    travelDate: DateString;
    status: string;
    totalPrice: number;
    createdAt: TimestampString;
  } & Booking_Key)[];
}

export interface GetMyFavoritesData {
  favorites: ({
    id: UUIDString;
    destination: {
      id: string;
      name: string;
      state: string;
      category?: string | null;
      rating?: number | null;
      images: string[];
    } & Destination_Key;
    createdAt: TimestampString;
  } & Favorite_Key)[];
}

export interface GetMyProfileData {
  traveler?: {
    uid: string;
    email: string;
    name?: string | null;
    phone?: string | null;
    role?: string | null;
    avatar?: string | null;
    homeCity?: string | null;
    travelStyle?: string | null;
    createdAt: TimestampString;
  } & Traveler_Key;
}

export interface GetMyTripsData {
  trips: ({
    id: UUIDString;
    title: string;
    destination: string;
    days: number;
    budget?: number | null;
    status?: string | null;
    createdAt: TimestampString;
  } & Trip_Key)[];
}

export interface ListDestinationsData {
  destinations: ({
    id: string;
    name: string;
    state: string;
    district?: string | null;
    region?: string | null;
    category?: string | null;
    overview?: string | null;
    images: string[];
    rating?: number | null;
    reviewsCount?: number | null;
    crowdLevel?: string | null;
    viewpointStatus?: string | null;
    stayCost?: number | null;
    foodCost?: number | null;
    travelCost?: number | null;
  } & Destination_Key)[];
}

export interface ListDestinationsVariables {
  state?: string | null;
  category?: string | null;
  limit?: number | null;
}

export interface RemoveFavoriteData {
  favorite_delete?: Favorite_Key | null;
}

export interface RemoveFavoriteVariables {
  id: UUIDString;
}

export interface Review_Key {
  id: UUIDString;
  __typename?: 'Review_Key';
}

export interface Traveler_Key {
  uid: string;
  __typename?: 'Traveler_Key';
}

export interface Trip_Key {
  id: UUIDString;
  __typename?: 'Trip_Key';
}

export interface UpsertTravelerProfileData {
  traveler_upsert: Traveler_Key;
}

export interface UpsertTravelerProfileVariables {
  name?: string | null;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  homeCity?: string | null;
  travelStyle?: string | null;
}

interface UpsertTravelerProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertTravelerProfileVariables): MutationRef<UpsertTravelerProfileData, UpsertTravelerProfileVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertTravelerProfileVariables): MutationRef<UpsertTravelerProfileData, UpsertTravelerProfileVariables>;
  operationName: string;
}
export const upsertTravelerProfileRef: UpsertTravelerProfileRef;

export function upsertTravelerProfile(vars: UpsertTravelerProfileVariables): MutationPromise<UpsertTravelerProfileData, UpsertTravelerProfileVariables>;
export function upsertTravelerProfile(dc: DataConnect, vars: UpsertTravelerProfileVariables): MutationPromise<UpsertTravelerProfileData, UpsertTravelerProfileVariables>;

interface CreateTripRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTripVariables): MutationRef<CreateTripData, CreateTripVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateTripVariables): MutationRef<CreateTripData, CreateTripVariables>;
  operationName: string;
}
export const createTripRef: CreateTripRef;

export function createTrip(vars: CreateTripVariables): MutationPromise<CreateTripData, CreateTripVariables>;
export function createTrip(dc: DataConnect, vars: CreateTripVariables): MutationPromise<CreateTripData, CreateTripVariables>;

interface DeleteTripRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTripVariables): MutationRef<DeleteTripData, DeleteTripVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteTripVariables): MutationRef<DeleteTripData, DeleteTripVariables>;
  operationName: string;
}
export const deleteTripRef: DeleteTripRef;

export function deleteTrip(vars: DeleteTripVariables): MutationPromise<DeleteTripData, DeleteTripVariables>;
export function deleteTrip(dc: DataConnect, vars: DeleteTripVariables): MutationPromise<DeleteTripData, DeleteTripVariables>;

interface CreateBookingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
  operationName: string;
}
export const createBookingRef: CreateBookingRef;

export function createBooking(vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;
export function createBooking(dc: DataConnect, vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface CancelBookingRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CancelBookingVariables): MutationRef<CancelBookingData, CancelBookingVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CancelBookingVariables): MutationRef<CancelBookingData, CancelBookingVariables>;
  operationName: string;
}
export const cancelBookingRef: CancelBookingRef;

export function cancelBooking(vars: CancelBookingVariables): MutationPromise<CancelBookingData, CancelBookingVariables>;
export function cancelBooking(dc: DataConnect, vars: CancelBookingVariables): MutationPromise<CancelBookingData, CancelBookingVariables>;

interface CreateReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
  operationName: string;
}
export const createReviewRef: CreateReviewRef;

export function createReview(vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;
export function createReview(dc: DataConnect, vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;

interface AddFavoriteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddFavoriteVariables): MutationRef<AddFavoriteData, AddFavoriteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddFavoriteVariables): MutationRef<AddFavoriteData, AddFavoriteVariables>;
  operationName: string;
}
export const addFavoriteRef: AddFavoriteRef;

export function addFavorite(vars: AddFavoriteVariables): MutationPromise<AddFavoriteData, AddFavoriteVariables>;
export function addFavorite(dc: DataConnect, vars: AddFavoriteVariables): MutationPromise<AddFavoriteData, AddFavoriteVariables>;

interface RemoveFavoriteRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveFavoriteVariables): MutationRef<RemoveFavoriteData, RemoveFavoriteVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RemoveFavoriteVariables): MutationRef<RemoveFavoriteData, RemoveFavoriteVariables>;
  operationName: string;
}
export const removeFavoriteRef: RemoveFavoriteRef;

export function removeFavorite(vars: RemoveFavoriteVariables): MutationPromise<RemoveFavoriteData, RemoveFavoriteVariables>;
export function removeFavorite(dc: DataConnect, vars: RemoveFavoriteVariables): MutationPromise<RemoveFavoriteData, RemoveFavoriteVariables>;

interface ListDestinationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListDestinationsVariables): QueryRef<ListDestinationsData, ListDestinationsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars?: ListDestinationsVariables): QueryRef<ListDestinationsData, ListDestinationsVariables>;
  operationName: string;
}
export const listDestinationsRef: ListDestinationsRef;

export function listDestinations(vars?: ListDestinationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListDestinationsData, ListDestinationsVariables>;
export function listDestinations(dc: DataConnect, vars?: ListDestinationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListDestinationsData, ListDestinationsVariables>;

interface GetDestinationByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDestinationByIdVariables): QueryRef<GetDestinationByIdData, GetDestinationByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetDestinationByIdVariables): QueryRef<GetDestinationByIdData, GetDestinationByIdVariables>;
  operationName: string;
}
export const getDestinationByIdRef: GetDestinationByIdRef;

export function getDestinationById(vars: GetDestinationByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetDestinationByIdData, GetDestinationByIdVariables>;
export function getDestinationById(dc: DataConnect, vars: GetDestinationByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetDestinationByIdData, GetDestinationByIdVariables>;

interface GetMyProfileRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyProfileData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyProfileData, undefined>;
  operationName: string;
}
export const getMyProfileRef: GetMyProfileRef;

export function getMyProfile(options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;
export function getMyProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;

interface GetMyTripsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyTripsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyTripsData, undefined>;
  operationName: string;
}
export const getMyTripsRef: GetMyTripsRef;

export function getMyTrips(options?: ExecuteQueryOptions): QueryPromise<GetMyTripsData, undefined>;
export function getMyTrips(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyTripsData, undefined>;

interface GetMyBookingsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyBookingsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyBookingsData, undefined>;
  operationName: string;
}
export const getMyBookingsRef: GetMyBookingsRef;

export function getMyBookings(options?: ExecuteQueryOptions): QueryPromise<GetMyBookingsData, undefined>;
export function getMyBookings(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyBookingsData, undefined>;

interface GetMyFavoritesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyFavoritesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyFavoritesData, undefined>;
  operationName: string;
}
export const getMyFavoritesRef: GetMyFavoritesRef;

export function getMyFavorites(options?: ExecuteQueryOptions): QueryPromise<GetMyFavoritesData, undefined>;
export function getMyFavorites(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyFavoritesData, undefined>;

