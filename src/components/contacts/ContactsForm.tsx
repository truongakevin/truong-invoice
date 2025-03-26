import React from 'react';

const ContactsForm = ({
	handleSubmit,
	newContact,
	setNewContact,
	setShowForm,
}: {
	handleSubmit: (e: React.FormEvent) => void;
	newContact: any;
	setNewContact: React.Dispatch<React.SetStateAction<any>>;
	setShowForm: (state: boolean) => void;
}) => {
	const capitalizeFirstLetter = (text: string) => {
		return text.charAt(0).toUpperCase() + text.slice(1);
	};
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();

			const form = e.currentTarget.form;
			if (!form) return;

			const index = Array.from(form.elements).indexOf(e.currentTarget);
			const nextElement = form.elements[index + 1] as HTMLElement;

			if (nextElement) {
			nextElement.focus();
			}
		}
		};
	return (
		<div>
			<div className="w-full">
				<div className="flex flex-row justify-between">
					<h2 className="text-3xl font-semibold py-4 pt-2">Add New Contact</h2>
					<button onClick={() => setShowForm(false)} className="font-bold text-4xl text-black px-2 pt-0 pb-4 hover:text-gray-400 transition">
					&times;
					</button>
				</div>
				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					<div className='flex justify-between gap-3'>
						<input
							type="text"
							placeholder="First Name"
							value={newContact.firstName}
							onChange={(e) => setNewContact({ ...newContact, firstName: capitalizeFirstLetter(e.target.value) })}
							onKeyDown={handleKeyDown}
							className="w-full border-2 shadow-md rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
							required
						/>
						<input
							type="text"
							placeholder="Last Name"
							value={newContact.lastName}
							onChange={(e) => setNewContact({ ...newContact, lastName: capitalizeFirstLetter(e.target.value) })}
							onKeyDown={handleKeyDown}
							className="w-full border-2 shadow-md rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
							required
						/>
					</div>
					<input
						type="email"
						placeholder="Email"
						value={newContact.email}
						onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
						onKeyDown={handleKeyDown}
						className="border-2 shadow-md rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
					/>
					<input
						type="text"
						placeholder="Phone"
						value={newContact.phone}
						onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
						onKeyDown={handleKeyDown}
						className="border-2 shadow-md rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
						pattern="^\d{10}$"
						inputMode="numeric"
						title="Phone number must be 10 digits."
					/>
					<input
						type="text"
						placeholder="Address"
						value={newContact.address1}
						onChange={(e) => setNewContact({ ...newContact, address1: e.target.value })}
						onKeyDown={handleKeyDown}
						className="border-2 shadow-md rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
						required
					/>
					<input
						type="text"
						placeholder="Apartment, Suite, Etc"
						value={newContact.address2}
						onChange={(e) => setNewContact({ ...newContact, address2: e.target.value })}
						onKeyDown={handleKeyDown}
						className="border-2 shadow-md rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
					/>
					<div className='flex w-full gap-3'>
						<input
							type="text"
							placeholder="City"
							value={newContact.city}
							onChange={(e) => setNewContact({ ...newContact, city: e.target.value })}
							onKeyDown={handleKeyDown}
							className="w-6/12 border-2 shadow-md rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
							/>
						<input
							type="text"
							placeholder="State"
							value={newContact.state}
							onChange={(e) => setNewContact({ ...newContact, state: e.target.value })}
							onKeyDown={handleKeyDown}
							className="w-3/12 border-2 shadow-md rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
							/>
						<input
							type="text"
							placeholder="Zip Code"
							value={newContact.zipCode}
							onChange={(e) => setNewContact({ ...newContact, zipCode: e.target.value })}
							onKeyDown={handleKeyDown}
							className="w-3/12 border-2 shadow-md rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
							/>
					</div>
					<div className='flex flex-row gap-2 y-2'>
						<button onClick={() => setShowForm(false)} className="font-semibold text-lg bg-gray-600 text-white rounded-lg shadow-md px-6 py-2 h-min hover:bg-gray-700 transition">Cancel</button>
						<button type="submit" className="font-semibold text-lg bg-green-600 text-white rounded-lg shadow-md px-6 py-2 h-min hover:bg-green-700 transition">Create</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ContactsForm;
