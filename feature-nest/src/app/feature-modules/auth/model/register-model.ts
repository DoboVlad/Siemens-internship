export interface RegisterDataModel {
  firstName: string;
  lastName: string;
  email: string;
  userId?: string;
  cart: {
    subtotalPriceProducts?: Number;
    numberOfProducts?: Number;
  };
}
