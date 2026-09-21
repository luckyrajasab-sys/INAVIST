# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertTravelerProfile, createTrip, deleteTrip, createBooking, cancelBooking, createReview, addFavorite, removeFavorite, listDestinations, getDestinationById } from '@inavist/dataconnect';


// Operation UpsertTravelerProfile:  For variables, look at type UpsertTravelerProfileVars in ../index.d.ts
const { data } = await UpsertTravelerProfile(dataConnect, upsertTravelerProfileVars);

// Operation CreateTrip:  For variables, look at type CreateTripVars in ../index.d.ts
const { data } = await CreateTrip(dataConnect, createTripVars);

// Operation DeleteTrip:  For variables, look at type DeleteTripVars in ../index.d.ts
const { data } = await DeleteTrip(dataConnect, deleteTripVars);

// Operation CreateBooking:  For variables, look at type CreateBookingVars in ../index.d.ts
const { data } = await CreateBooking(dataConnect, createBookingVars);

// Operation CancelBooking:  For variables, look at type CancelBookingVars in ../index.d.ts
const { data } = await CancelBooking(dataConnect, cancelBookingVars);

// Operation CreateReview:  For variables, look at type CreateReviewVars in ../index.d.ts
const { data } = await CreateReview(dataConnect, createReviewVars);

// Operation AddFavorite:  For variables, look at type AddFavoriteVars in ../index.d.ts
const { data } = await AddFavorite(dataConnect, addFavoriteVars);

// Operation RemoveFavorite:  For variables, look at type RemoveFavoriteVars in ../index.d.ts
const { data } = await RemoveFavorite(dataConnect, removeFavoriteVars);

// Operation ListDestinations:  For variables, look at type ListDestinationsVars in ../index.d.ts
const { data } = await ListDestinations(dataConnect, listDestinationsVars);

// Operation GetDestinationById:  For variables, look at type GetDestinationByIdVars in ../index.d.ts
const { data } = await GetDestinationById(dataConnect, getDestinationByIdVars);


```