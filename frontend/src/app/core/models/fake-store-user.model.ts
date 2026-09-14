export interface FakeStoreGeoLocation {
  lat: string;
  long: string;
}

export interface FakeStoreAddress {
  city: string;
  street: string;
  number: number;
  zipcode: string;

  geolocation?: FakeStoreGeoLocation | null;
}

export interface FakeStoreUserName {
  firstname: string;
  lastname: string;
}

export interface FakeStoreUser {
  id: number;

  email: string;

  username: string;

  name: FakeStoreUserName;

  address?: FakeStoreAddress | null;

  phone: string;
}