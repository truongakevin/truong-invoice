// src/types.ts

export interface Contact {
	ContactID: number;
	FirstName: string;
	LastName: string;
	Email: string;
	Phone: string;
	Address1: string;
	Address2?: string | null;
	City: string;
	State: string;
	ZipCode: string;
}
  
export interface Invoice {
	InvoiceID: number;
	ContactID: number;
	InvoiceDate: string;
	DueDate: string;
	TotalAmount: number;
	PaidAmount: number;
	DueAmount: number;
	Status: string;
}
  
export interface Service {
	ServiceID: number,
	InvoiceID: number,
	ServiceDescription: string,
	ServiceDate: string,
	Quantity: number,
	Rate: number,
}