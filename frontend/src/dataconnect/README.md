# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `default`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListDestinations*](#listdestinations)
  - [*GetDestinationById*](#getdestinationbyid)
  - [*GetMyProfile*](#getmyprofile)
  - [*GetMyTrips*](#getmytrips)
  - [*GetMyBookings*](#getmybookings)
  - [*GetMyFavorites*](#getmyfavorites)
- [**Mutations**](#mutations)
  - [*UpsertTravelerProfile*](#upserttravelerprofile)
  - [*CreateTrip*](#createtrip)
  - [*DeleteTrip*](#deletetrip)
  - [*CreateBooking*](#createbooking)
  - [*CancelBooking*](#cancelbooking)
  - [*CreateReview*](#createreview)
  - [*AddFavorite*](#addfavorite)
  - [*RemoveFavorite*](#removefavorite)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `default`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@inavist/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@inavist/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@inavist/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListDestinations
You can execute the `ListDestinations` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
listDestinations(vars?: ListDestinationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListDestinationsData, ListDestinationsVariables>;

interface ListDestinationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: ListDestinationsVariables): QueryRef<ListDestinationsData, ListDestinationsVariables>;
}
export const listDestinationsRef: ListDestinationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listDestinations(dc: DataConnect, vars?: ListDestinationsVariables, options?: ExecuteQueryOptions): QueryPromise<ListDestinationsData, ListDestinationsVariables>;

interface ListDestinationsRef {
  ...
  (dc: DataConnect, vars?: ListDestinationsVariables): QueryRef<ListDestinationsData, ListDestinationsVariables>;
}
export const listDestinationsRef: ListDestinationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listDestinationsRef:
```typescript
const name = listDestinationsRef.operationName;
console.log(name);
```

### Variables
The `ListDestinations` query has an optional argument of type `ListDestinationsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListDestinationsVariables {
  state?: string | null;
  category?: string | null;
  limit?: number | null;
}
```
### Return Type
Recall that executing the `ListDestinations` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListDestinationsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListDestinations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listDestinations, ListDestinationsVariables } from '@inavist/dataconnect';

// The `ListDestinations` query has an optional argument of type `ListDestinationsVariables`:
const listDestinationsVars: ListDestinationsVariables = {
  state: ..., // optional
  category: ..., // optional
  limit: ..., // optional
};

// Call the `listDestinations()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listDestinations(listDestinationsVars);
// Variables can be defined inline as well.
const { data } = await listDestinations({ state: ..., category: ..., limit: ..., });
// Since all variables are optional for this query, you can omit the `ListDestinationsVariables` argument.
const { data } = await listDestinations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listDestinations(dataConnect, listDestinationsVars);

console.log(data.destinations);

// Or, you can use the `Promise` API.
listDestinations(listDestinationsVars).then((response) => {
  const data = response.data;
  console.log(data.destinations);
});
```

### Using `ListDestinations`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listDestinationsRef, ListDestinationsVariables } from '@inavist/dataconnect';

// The `ListDestinations` query has an optional argument of type `ListDestinationsVariables`:
const listDestinationsVars: ListDestinationsVariables = {
  state: ..., // optional
  category: ..., // optional
  limit: ..., // optional
};

// Call the `listDestinationsRef()` function to get a reference to the query.
const ref = listDestinationsRef(listDestinationsVars);
// Variables can be defined inline as well.
const ref = listDestinationsRef({ state: ..., category: ..., limit: ..., });
// Since all variables are optional for this query, you can omit the `ListDestinationsVariables` argument.
const ref = listDestinationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listDestinationsRef(dataConnect, listDestinationsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.destinations);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.destinations);
});
```

## GetDestinationById
You can execute the `GetDestinationById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getDestinationById(vars: GetDestinationByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetDestinationByIdData, GetDestinationByIdVariables>;

interface GetDestinationByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetDestinationByIdVariables): QueryRef<GetDestinationByIdData, GetDestinationByIdVariables>;
}
export const getDestinationByIdRef: GetDestinationByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getDestinationById(dc: DataConnect, vars: GetDestinationByIdVariables, options?: ExecuteQueryOptions): QueryPromise<GetDestinationByIdData, GetDestinationByIdVariables>;

interface GetDestinationByIdRef {
  ...
  (dc: DataConnect, vars: GetDestinationByIdVariables): QueryRef<GetDestinationByIdData, GetDestinationByIdVariables>;
}
export const getDestinationByIdRef: GetDestinationByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getDestinationByIdRef:
```typescript
const name = getDestinationByIdRef.operationName;
console.log(name);
```

### Variables
The `GetDestinationById` query requires an argument of type `GetDestinationByIdVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetDestinationByIdVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetDestinationById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetDestinationByIdData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetDestinationById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getDestinationById, GetDestinationByIdVariables } from '@inavist/dataconnect';

// The `GetDestinationById` query requires an argument of type `GetDestinationByIdVariables`:
const getDestinationByIdVars: GetDestinationByIdVariables = {
  id: ..., 
};

// Call the `getDestinationById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getDestinationById(getDestinationByIdVars);
// Variables can be defined inline as well.
const { data } = await getDestinationById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getDestinationById(dataConnect, getDestinationByIdVars);

console.log(data.destination);

// Or, you can use the `Promise` API.
getDestinationById(getDestinationByIdVars).then((response) => {
  const data = response.data;
  console.log(data.destination);
});
```

### Using `GetDestinationById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getDestinationByIdRef, GetDestinationByIdVariables } from '@inavist/dataconnect';

// The `GetDestinationById` query requires an argument of type `GetDestinationByIdVariables`:
const getDestinationByIdVars: GetDestinationByIdVariables = {
  id: ..., 
};

// Call the `getDestinationByIdRef()` function to get a reference to the query.
const ref = getDestinationByIdRef(getDestinationByIdVars);
// Variables can be defined inline as well.
const ref = getDestinationByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getDestinationByIdRef(dataConnect, getDestinationByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.destination);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.destination);
});
```

## GetMyProfile
You can execute the `GetMyProfile` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getMyProfile(options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;

interface GetMyProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyProfileData, undefined>;
}
export const getMyProfileRef: GetMyProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyProfile(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyProfileData, undefined>;

interface GetMyProfileRef {
  ...
  (dc: DataConnect): QueryRef<GetMyProfileData, undefined>;
}
export const getMyProfileRef: GetMyProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyProfileRef:
```typescript
const name = getMyProfileRef.operationName;
console.log(name);
```

### Variables
The `GetMyProfile` query has no variables.
### Return Type
Recall that executing the `GetMyProfile` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyProfileData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetMyProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyProfile } from '@inavist/dataconnect';


// Call the `getMyProfile()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyProfile();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyProfile(dataConnect);

console.log(data.traveler);

// Or, you can use the `Promise` API.
getMyProfile().then((response) => {
  const data = response.data;
  console.log(data.traveler);
});
```

### Using `GetMyProfile`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyProfileRef } from '@inavist/dataconnect';


// Call the `getMyProfileRef()` function to get a reference to the query.
const ref = getMyProfileRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyProfileRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.traveler);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.traveler);
});
```

## GetMyTrips
You can execute the `GetMyTrips` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getMyTrips(options?: ExecuteQueryOptions): QueryPromise<GetMyTripsData, undefined>;

interface GetMyTripsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyTripsData, undefined>;
}
export const getMyTripsRef: GetMyTripsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyTrips(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyTripsData, undefined>;

interface GetMyTripsRef {
  ...
  (dc: DataConnect): QueryRef<GetMyTripsData, undefined>;
}
export const getMyTripsRef: GetMyTripsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyTripsRef:
```typescript
const name = getMyTripsRef.operationName;
console.log(name);
```

### Variables
The `GetMyTrips` query has no variables.
### Return Type
Recall that executing the `GetMyTrips` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyTripsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetMyTrips`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyTrips } from '@inavist/dataconnect';


// Call the `getMyTrips()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyTrips();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyTrips(dataConnect);

console.log(data.trips);

// Or, you can use the `Promise` API.
getMyTrips().then((response) => {
  const data = response.data;
  console.log(data.trips);
});
```

### Using `GetMyTrips`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyTripsRef } from '@inavist/dataconnect';


// Call the `getMyTripsRef()` function to get a reference to the query.
const ref = getMyTripsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyTripsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.trips);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.trips);
});
```

## GetMyBookings
You can execute the `GetMyBookings` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getMyBookings(options?: ExecuteQueryOptions): QueryPromise<GetMyBookingsData, undefined>;

interface GetMyBookingsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyBookingsData, undefined>;
}
export const getMyBookingsRef: GetMyBookingsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyBookings(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyBookingsData, undefined>;

interface GetMyBookingsRef {
  ...
  (dc: DataConnect): QueryRef<GetMyBookingsData, undefined>;
}
export const getMyBookingsRef: GetMyBookingsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyBookingsRef:
```typescript
const name = getMyBookingsRef.operationName;
console.log(name);
```

### Variables
The `GetMyBookings` query has no variables.
### Return Type
Recall that executing the `GetMyBookings` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyBookingsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetMyBookings`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyBookings } from '@inavist/dataconnect';


// Call the `getMyBookings()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyBookings();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyBookings(dataConnect);

console.log(data.bookings);

// Or, you can use the `Promise` API.
getMyBookings().then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

### Using `GetMyBookings`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyBookingsRef } from '@inavist/dataconnect';


// Call the `getMyBookingsRef()` function to get a reference to the query.
const ref = getMyBookingsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyBookingsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.bookings);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.bookings);
});
```

## GetMyFavorites
You can execute the `GetMyFavorites` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getMyFavorites(options?: ExecuteQueryOptions): QueryPromise<GetMyFavoritesData, undefined>;

interface GetMyFavoritesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyFavoritesData, undefined>;
}
export const getMyFavoritesRef: GetMyFavoritesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyFavorites(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyFavoritesData, undefined>;

interface GetMyFavoritesRef {
  ...
  (dc: DataConnect): QueryRef<GetMyFavoritesData, undefined>;
}
export const getMyFavoritesRef: GetMyFavoritesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyFavoritesRef:
```typescript
const name = getMyFavoritesRef.operationName;
console.log(name);
```

### Variables
The `GetMyFavorites` query has no variables.
### Return Type
Recall that executing the `GetMyFavorites` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyFavoritesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetMyFavorites`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyFavorites } from '@inavist/dataconnect';


// Call the `getMyFavorites()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyFavorites();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyFavorites(dataConnect);

console.log(data.favorites);

// Or, you can use the `Promise` API.
getMyFavorites().then((response) => {
  const data = response.data;
  console.log(data.favorites);
});
```

### Using `GetMyFavorites`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyFavoritesRef } from '@inavist/dataconnect';


// Call the `getMyFavoritesRef()` function to get a reference to the query.
const ref = getMyFavoritesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyFavoritesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.favorites);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.favorites);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `default` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertTravelerProfile
You can execute the `UpsertTravelerProfile` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
upsertTravelerProfile(vars: UpsertTravelerProfileVariables): MutationPromise<UpsertTravelerProfileData, UpsertTravelerProfileVariables>;

interface UpsertTravelerProfileRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertTravelerProfileVariables): MutationRef<UpsertTravelerProfileData, UpsertTravelerProfileVariables>;
}
export const upsertTravelerProfileRef: UpsertTravelerProfileRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertTravelerProfile(dc: DataConnect, vars: UpsertTravelerProfileVariables): MutationPromise<UpsertTravelerProfileData, UpsertTravelerProfileVariables>;

interface UpsertTravelerProfileRef {
  ...
  (dc: DataConnect, vars: UpsertTravelerProfileVariables): MutationRef<UpsertTravelerProfileData, UpsertTravelerProfileVariables>;
}
export const upsertTravelerProfileRef: UpsertTravelerProfileRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertTravelerProfileRef:
```typescript
const name = upsertTravelerProfileRef.operationName;
console.log(name);
```

### Variables
The `UpsertTravelerProfile` mutation requires an argument of type `UpsertTravelerProfileVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertTravelerProfileVariables {
  name?: string | null;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  homeCity?: string | null;
  travelStyle?: string | null;
}
```
### Return Type
Recall that executing the `UpsertTravelerProfile` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertTravelerProfileData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertTravelerProfileData {
  traveler_upsert: Traveler_Key;
}
```
### Using `UpsertTravelerProfile`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertTravelerProfile, UpsertTravelerProfileVariables } from '@inavist/dataconnect';

// The `UpsertTravelerProfile` mutation requires an argument of type `UpsertTravelerProfileVariables`:
const upsertTravelerProfileVars: UpsertTravelerProfileVariables = {
  name: ..., // optional
  email: ..., 
  phone: ..., // optional
  avatar: ..., // optional
  homeCity: ..., // optional
  travelStyle: ..., // optional
};

// Call the `upsertTravelerProfile()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertTravelerProfile(upsertTravelerProfileVars);
// Variables can be defined inline as well.
const { data } = await upsertTravelerProfile({ name: ..., email: ..., phone: ..., avatar: ..., homeCity: ..., travelStyle: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertTravelerProfile(dataConnect, upsertTravelerProfileVars);

console.log(data.traveler_upsert);

// Or, you can use the `Promise` API.
upsertTravelerProfile(upsertTravelerProfileVars).then((response) => {
  const data = response.data;
  console.log(data.traveler_upsert);
});
```

### Using `UpsertTravelerProfile`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertTravelerProfileRef, UpsertTravelerProfileVariables } from '@inavist/dataconnect';

// The `UpsertTravelerProfile` mutation requires an argument of type `UpsertTravelerProfileVariables`:
const upsertTravelerProfileVars: UpsertTravelerProfileVariables = {
  name: ..., // optional
  email: ..., 
  phone: ..., // optional
  avatar: ..., // optional
  homeCity: ..., // optional
  travelStyle: ..., // optional
};

// Call the `upsertTravelerProfileRef()` function to get a reference to the mutation.
const ref = upsertTravelerProfileRef(upsertTravelerProfileVars);
// Variables can be defined inline as well.
const ref = upsertTravelerProfileRef({ name: ..., email: ..., phone: ..., avatar: ..., homeCity: ..., travelStyle: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertTravelerProfileRef(dataConnect, upsertTravelerProfileVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.traveler_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.traveler_upsert);
});
```

## CreateTrip
You can execute the `CreateTrip` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createTrip(vars: CreateTripVariables): MutationPromise<CreateTripData, CreateTripVariables>;

interface CreateTripRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateTripVariables): MutationRef<CreateTripData, CreateTripVariables>;
}
export const createTripRef: CreateTripRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createTrip(dc: DataConnect, vars: CreateTripVariables): MutationPromise<CreateTripData, CreateTripVariables>;

interface CreateTripRef {
  ...
  (dc: DataConnect, vars: CreateTripVariables): MutationRef<CreateTripData, CreateTripVariables>;
}
export const createTripRef: CreateTripRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createTripRef:
```typescript
const name = createTripRef.operationName;
console.log(name);
```

### Variables
The `CreateTrip` mutation requires an argument of type `CreateTripVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateTripVariables {
  title: string;
  destination: string;
  days: number;
  budget?: number | null;
}
```
### Return Type
Recall that executing the `CreateTrip` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateTripData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateTripData {
  trip_insert: Trip_Key;
}
```
### Using `CreateTrip`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createTrip, CreateTripVariables } from '@inavist/dataconnect';

// The `CreateTrip` mutation requires an argument of type `CreateTripVariables`:
const createTripVars: CreateTripVariables = {
  title: ..., 
  destination: ..., 
  days: ..., 
  budget: ..., // optional
};

// Call the `createTrip()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createTrip(createTripVars);
// Variables can be defined inline as well.
const { data } = await createTrip({ title: ..., destination: ..., days: ..., budget: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createTrip(dataConnect, createTripVars);

console.log(data.trip_insert);

// Or, you can use the `Promise` API.
createTrip(createTripVars).then((response) => {
  const data = response.data;
  console.log(data.trip_insert);
});
```

### Using `CreateTrip`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createTripRef, CreateTripVariables } from '@inavist/dataconnect';

// The `CreateTrip` mutation requires an argument of type `CreateTripVariables`:
const createTripVars: CreateTripVariables = {
  title: ..., 
  destination: ..., 
  days: ..., 
  budget: ..., // optional
};

// Call the `createTripRef()` function to get a reference to the mutation.
const ref = createTripRef(createTripVars);
// Variables can be defined inline as well.
const ref = createTripRef({ title: ..., destination: ..., days: ..., budget: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createTripRef(dataConnect, createTripVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.trip_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.trip_insert);
});
```

## DeleteTrip
You can execute the `DeleteTrip` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
deleteTrip(vars: DeleteTripVariables): MutationPromise<DeleteTripData, DeleteTripVariables>;

interface DeleteTripRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteTripVariables): MutationRef<DeleteTripData, DeleteTripVariables>;
}
export const deleteTripRef: DeleteTripRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteTrip(dc: DataConnect, vars: DeleteTripVariables): MutationPromise<DeleteTripData, DeleteTripVariables>;

interface DeleteTripRef {
  ...
  (dc: DataConnect, vars: DeleteTripVariables): MutationRef<DeleteTripData, DeleteTripVariables>;
}
export const deleteTripRef: DeleteTripRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteTripRef:
```typescript
const name = deleteTripRef.operationName;
console.log(name);
```

### Variables
The `DeleteTrip` mutation requires an argument of type `DeleteTripVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteTripVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteTrip` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteTripData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteTripData {
  trip_delete?: Trip_Key | null;
}
```
### Using `DeleteTrip`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteTrip, DeleteTripVariables } from '@inavist/dataconnect';

// The `DeleteTrip` mutation requires an argument of type `DeleteTripVariables`:
const deleteTripVars: DeleteTripVariables = {
  id: ..., 
};

// Call the `deleteTrip()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteTrip(deleteTripVars);
// Variables can be defined inline as well.
const { data } = await deleteTrip({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteTrip(dataConnect, deleteTripVars);

console.log(data.trip_delete);

// Or, you can use the `Promise` API.
deleteTrip(deleteTripVars).then((response) => {
  const data = response.data;
  console.log(data.trip_delete);
});
```

### Using `DeleteTrip`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteTripRef, DeleteTripVariables } from '@inavist/dataconnect';

// The `DeleteTrip` mutation requires an argument of type `DeleteTripVariables`:
const deleteTripVars: DeleteTripVariables = {
  id: ..., 
};

// Call the `deleteTripRef()` function to get a reference to the mutation.
const ref = deleteTripRef(deleteTripVars);
// Variables can be defined inline as well.
const ref = deleteTripRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteTripRef(dataConnect, deleteTripVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.trip_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.trip_delete);
});
```

## CreateBooking
You can execute the `CreateBooking` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createBooking(vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface CreateBookingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
}
export const createBookingRef: CreateBookingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createBooking(dc: DataConnect, vars: CreateBookingVariables): MutationPromise<CreateBookingData, CreateBookingVariables>;

interface CreateBookingRef {
  ...
  (dc: DataConnect, vars: CreateBookingVariables): MutationRef<CreateBookingData, CreateBookingVariables>;
}
export const createBookingRef: CreateBookingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createBookingRef:
```typescript
const name = createBookingRef.operationName;
console.log(name);
```

### Variables
The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateBookingVariables {
  pnrNumber: string;
  mode: string;
  serviceName: string;
  origin: string;
  destination: string;
  travelDate: DateString;
  totalPrice: number;
}
```
### Return Type
Recall that executing the `CreateBooking` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateBookingData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateBookingData {
  booking_insert: Booking_Key;
}
```
### Using `CreateBooking`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createBooking, CreateBookingVariables } from '@inavist/dataconnect';

// The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`:
const createBookingVars: CreateBookingVariables = {
  pnrNumber: ..., 
  mode: ..., 
  serviceName: ..., 
  origin: ..., 
  destination: ..., 
  travelDate: ..., 
  totalPrice: ..., 
};

// Call the `createBooking()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBooking(createBookingVars);
// Variables can be defined inline as well.
const { data } = await createBooking({ pnrNumber: ..., mode: ..., serviceName: ..., origin: ..., destination: ..., travelDate: ..., totalPrice: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createBooking(dataConnect, createBookingVars);

console.log(data.booking_insert);

// Or, you can use the `Promise` API.
createBooking(createBookingVars).then((response) => {
  const data = response.data;
  console.log(data.booking_insert);
});
```

### Using `CreateBooking`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createBookingRef, CreateBookingVariables } from '@inavist/dataconnect';

// The `CreateBooking` mutation requires an argument of type `CreateBookingVariables`:
const createBookingVars: CreateBookingVariables = {
  pnrNumber: ..., 
  mode: ..., 
  serviceName: ..., 
  origin: ..., 
  destination: ..., 
  travelDate: ..., 
  totalPrice: ..., 
};

// Call the `createBookingRef()` function to get a reference to the mutation.
const ref = createBookingRef(createBookingVars);
// Variables can be defined inline as well.
const ref = createBookingRef({ pnrNumber: ..., mode: ..., serviceName: ..., origin: ..., destination: ..., travelDate: ..., totalPrice: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createBookingRef(dataConnect, createBookingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.booking_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.booking_insert);
});
```

## CancelBooking
You can execute the `CancelBooking` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
cancelBooking(vars: CancelBookingVariables): MutationPromise<CancelBookingData, CancelBookingVariables>;

interface CancelBookingRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CancelBookingVariables): MutationRef<CancelBookingData, CancelBookingVariables>;
}
export const cancelBookingRef: CancelBookingRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
cancelBooking(dc: DataConnect, vars: CancelBookingVariables): MutationPromise<CancelBookingData, CancelBookingVariables>;

interface CancelBookingRef {
  ...
  (dc: DataConnect, vars: CancelBookingVariables): MutationRef<CancelBookingData, CancelBookingVariables>;
}
export const cancelBookingRef: CancelBookingRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the cancelBookingRef:
```typescript
const name = cancelBookingRef.operationName;
console.log(name);
```

### Variables
The `CancelBooking` mutation requires an argument of type `CancelBookingVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CancelBookingVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `CancelBooking` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CancelBookingData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CancelBookingData {
  booking_update?: Booking_Key | null;
}
```
### Using `CancelBooking`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, cancelBooking, CancelBookingVariables } from '@inavist/dataconnect';

// The `CancelBooking` mutation requires an argument of type `CancelBookingVariables`:
const cancelBookingVars: CancelBookingVariables = {
  id: ..., 
};

// Call the `cancelBooking()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await cancelBooking(cancelBookingVars);
// Variables can be defined inline as well.
const { data } = await cancelBooking({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await cancelBooking(dataConnect, cancelBookingVars);

console.log(data.booking_update);

// Or, you can use the `Promise` API.
cancelBooking(cancelBookingVars).then((response) => {
  const data = response.data;
  console.log(data.booking_update);
});
```

### Using `CancelBooking`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, cancelBookingRef, CancelBookingVariables } from '@inavist/dataconnect';

// The `CancelBooking` mutation requires an argument of type `CancelBookingVariables`:
const cancelBookingVars: CancelBookingVariables = {
  id: ..., 
};

// Call the `cancelBookingRef()` function to get a reference to the mutation.
const ref = cancelBookingRef(cancelBookingVars);
// Variables can be defined inline as well.
const ref = cancelBookingRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = cancelBookingRef(dataConnect, cancelBookingVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.booking_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.booking_update);
});
```

## CreateReview
You can execute the `CreateReview` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createReview(vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;

interface CreateReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
}
export const createReviewRef: CreateReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createReview(dc: DataConnect, vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;

interface CreateReviewRef {
  ...
  (dc: DataConnect, vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
}
export const createReviewRef: CreateReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createReviewRef:
```typescript
const name = createReviewRef.operationName;
console.log(name);
```

### Variables
The `CreateReview` mutation requires an argument of type `CreateReviewVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateReviewVariables {
  destinationId: string;
  rating: number;
  comment: string;
  visitMonth?: string | null;
}
```
### Return Type
Recall that executing the `CreateReview` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateReviewData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateReviewData {
  review_insert: Review_Key;
}
```
### Using `CreateReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createReview, CreateReviewVariables } from '@inavist/dataconnect';

// The `CreateReview` mutation requires an argument of type `CreateReviewVariables`:
const createReviewVars: CreateReviewVariables = {
  destinationId: ..., 
  rating: ..., 
  comment: ..., 
  visitMonth: ..., // optional
};

// Call the `createReview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createReview(createReviewVars);
// Variables can be defined inline as well.
const { data } = await createReview({ destinationId: ..., rating: ..., comment: ..., visitMonth: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createReview(dataConnect, createReviewVars);

console.log(data.review_insert);

// Or, you can use the `Promise` API.
createReview(createReviewVars).then((response) => {
  const data = response.data;
  console.log(data.review_insert);
});
```

### Using `CreateReview`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createReviewRef, CreateReviewVariables } from '@inavist/dataconnect';

// The `CreateReview` mutation requires an argument of type `CreateReviewVariables`:
const createReviewVars: CreateReviewVariables = {
  destinationId: ..., 
  rating: ..., 
  comment: ..., 
  visitMonth: ..., // optional
};

// Call the `createReviewRef()` function to get a reference to the mutation.
const ref = createReviewRef(createReviewVars);
// Variables can be defined inline as well.
const ref = createReviewRef({ destinationId: ..., rating: ..., comment: ..., visitMonth: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createReviewRef(dataConnect, createReviewVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.review_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.review_insert);
});
```

## AddFavorite
You can execute the `AddFavorite` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
addFavorite(vars: AddFavoriteVariables): MutationPromise<AddFavoriteData, AddFavoriteVariables>;

interface AddFavoriteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddFavoriteVariables): MutationRef<AddFavoriteData, AddFavoriteVariables>;
}
export const addFavoriteRef: AddFavoriteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addFavorite(dc: DataConnect, vars: AddFavoriteVariables): MutationPromise<AddFavoriteData, AddFavoriteVariables>;

interface AddFavoriteRef {
  ...
  (dc: DataConnect, vars: AddFavoriteVariables): MutationRef<AddFavoriteData, AddFavoriteVariables>;
}
export const addFavoriteRef: AddFavoriteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addFavoriteRef:
```typescript
const name = addFavoriteRef.operationName;
console.log(name);
```

### Variables
The `AddFavorite` mutation requires an argument of type `AddFavoriteVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddFavoriteVariables {
  destinationId: string;
}
```
### Return Type
Recall that executing the `AddFavorite` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddFavoriteData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddFavoriteData {
  favorite_insert: Favorite_Key;
}
```
### Using `AddFavorite`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addFavorite, AddFavoriteVariables } from '@inavist/dataconnect';

// The `AddFavorite` mutation requires an argument of type `AddFavoriteVariables`:
const addFavoriteVars: AddFavoriteVariables = {
  destinationId: ..., 
};

// Call the `addFavorite()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addFavorite(addFavoriteVars);
// Variables can be defined inline as well.
const { data } = await addFavorite({ destinationId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addFavorite(dataConnect, addFavoriteVars);

console.log(data.favorite_insert);

// Or, you can use the `Promise` API.
addFavorite(addFavoriteVars).then((response) => {
  const data = response.data;
  console.log(data.favorite_insert);
});
```

### Using `AddFavorite`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addFavoriteRef, AddFavoriteVariables } from '@inavist/dataconnect';

// The `AddFavorite` mutation requires an argument of type `AddFavoriteVariables`:
const addFavoriteVars: AddFavoriteVariables = {
  destinationId: ..., 
};

// Call the `addFavoriteRef()` function to get a reference to the mutation.
const ref = addFavoriteRef(addFavoriteVars);
// Variables can be defined inline as well.
const ref = addFavoriteRef({ destinationId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addFavoriteRef(dataConnect, addFavoriteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.favorite_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.favorite_insert);
});
```

## RemoveFavorite
You can execute the `RemoveFavorite` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
removeFavorite(vars: RemoveFavoriteVariables): MutationPromise<RemoveFavoriteData, RemoveFavoriteVariables>;

interface RemoveFavoriteRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveFavoriteVariables): MutationRef<RemoveFavoriteData, RemoveFavoriteVariables>;
}
export const removeFavoriteRef: RemoveFavoriteRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
removeFavorite(dc: DataConnect, vars: RemoveFavoriteVariables): MutationPromise<RemoveFavoriteData, RemoveFavoriteVariables>;

interface RemoveFavoriteRef {
  ...
  (dc: DataConnect, vars: RemoveFavoriteVariables): MutationRef<RemoveFavoriteData, RemoveFavoriteVariables>;
}
export const removeFavoriteRef: RemoveFavoriteRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the removeFavoriteRef:
```typescript
const name = removeFavoriteRef.operationName;
console.log(name);
```

### Variables
The `RemoveFavorite` mutation requires an argument of type `RemoveFavoriteVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RemoveFavoriteVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `RemoveFavorite` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RemoveFavoriteData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RemoveFavoriteData {
  favorite_delete?: Favorite_Key | null;
}
```
### Using `RemoveFavorite`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, removeFavorite, RemoveFavoriteVariables } from '@inavist/dataconnect';

// The `RemoveFavorite` mutation requires an argument of type `RemoveFavoriteVariables`:
const removeFavoriteVars: RemoveFavoriteVariables = {
  id: ..., 
};

// Call the `removeFavorite()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await removeFavorite(removeFavoriteVars);
// Variables can be defined inline as well.
const { data } = await removeFavorite({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await removeFavorite(dataConnect, removeFavoriteVars);

console.log(data.favorite_delete);

// Or, you can use the `Promise` API.
removeFavorite(removeFavoriteVars).then((response) => {
  const data = response.data;
  console.log(data.favorite_delete);
});
```

### Using `RemoveFavorite`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, removeFavoriteRef, RemoveFavoriteVariables } from '@inavist/dataconnect';

// The `RemoveFavorite` mutation requires an argument of type `RemoveFavoriteVariables`:
const removeFavoriteVars: RemoveFavoriteVariables = {
  id: ..., 
};

// Call the `removeFavoriteRef()` function to get a reference to the mutation.
const ref = removeFavoriteRef(removeFavoriteVars);
// Variables can be defined inline as well.
const ref = removeFavoriteRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = removeFavoriteRef(dataConnect, removeFavoriteVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.favorite_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.favorite_delete);
});
```

