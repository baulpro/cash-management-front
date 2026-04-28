Technology for backend:
* Java spring boot.
* Use java 26.
* Use h2 for relational databse
* Use JPA ORM.+
* Gradle

Technology for front-end
* Angular 21
* Not to use framework for css or components. in other words, you have to use simple css, html and typescript as an normal angular project.

Best practices:
* Use lambdas for functional programming
* Spring Bean validation
* Manage exception messages by implementing exception handler
* Use pattern designs such as (Singleton, Decorator, Mediator, Strategy, Observer, MVC) in case they apply, because It depends on wether you are using angular or spring boot.
* Manage the Http methods: Get, Post, Put, Patch, Delete
* There should be a request DTO and reponse DTO. There is also a bussiness DTO that the program use in the middle in the service layer for example. So to mapper from request DTO to bussines DTO or to mapper from bussines DTO to response DTO.
It has to use mapstruct.
* The code has to be in english.
* Use enums for bd column types like type_account, transaction_type, etc as well as constants for the business logic when you need it.

Entities of Database H2
Person:
	person_id  	-> Primary key. Identifies each person uniquely in the database.
	name		-> Stores the person’s full name.
	gender		-> Stores the person’s gender.
	age			-> Stores the person’s age.
	address		-> Stores the person’s address.
	phone		-> Stores the person’s phone number.
	IDcard		-> Stores the person’s national identification/document number. (be unique)

Client:
. This entity have to inherit the Person properties.

	client_id	-> Primary key. Identifies each client uniquely.
	password	-> Stores the client’s password.
	status		-> Indicates whether the client is active, inactive. true (ACTIVE) and false (INACTIVE). Boolean type

Account:
	account_id	    	-> Primary key. Identifies each account uniquely.
	account_number		-> The bank account number shown to the user/client. (be unique)
	type_account		-> The type of account ("SAVING" or "CHECKINNG").
	original_balance	-> Stores the initial balance when the account is created.
	current_balance		-> The current available balance after credits and debits. I recommend adding this property.
	status				-> Indicates if the account is active or inactive. true (ACTIVE) and false (INACTIVE). Boolean type.
	client_id			-> ID of the client who owns the account. This connects Cuenta with Cliente.
	
Transactions:
	transaction_id		-> Primary key. Identifies each transaction uniquely.
	account_id			-> ID of the account where the movement was made. This connects Movimiento with Cuenta.
	date				-> Stores the date and time when the movement was made.
	transaction_type 	-> Defines if money enters or leaves the account. "CREDIT" or "DEBIT".
	amount				-> Stores the transaction amount. Credits are positive, debits are negative.
	available_balance	-> Balance available after applying this movement.

Instructions:
. Create four controllers: AccountController, ClientController, TransactionController and ReportController with the base path: /clients, /accounts, /transactions and /reports.
. in the website on left side, there will be a panel with  the sections: client, account, transaction and report.
When the user enters to client section. He will be able to see the existing clients with pagination. Also he will be able to create, delete and update a client.
The client table must show the columns: name, gender, age, IDcard and client status. So the user only could update these fields.
The user can filter the table by name or IDcard.

Rules: 
. the user can not create a client with the same IDcard. Otherwise a modal will open showing an error message.
. the user can not update a client by setting an existing IDCard. Otherwise a modal will open showing an error message.
. the user can not delete a client who has an account. Otherwise a modal will open showing an error message.

When the user enters to the account section. He will be able to see the existing accounts with pagination. Also he will be able to create a new account, delete an account and update it.
But the user only could update the account_number, type_account, transaction status and the client_id.
In the account table the user must see the columns: account_number, type_account, original_balance, current_balance, status and the client's name.
Also the user can filter by account_number, type_account or client's name.

Rules:
. the user can not create an account with the same account_number. Otherwise a modal will open showing an error message.
. the user can not update an account by setting an exsiting account_number. Otherwise a modal will open showing an error message.
. the user can not delete an accotun that has transactions.

When the user enters to the transaction section. He will be able to see the transactions with paginations.
The user can filter by account_number, client's name or a range of dates. (start date and end date).
So, in the filter section there will be an startDate field and endDate field.
Also, the user can make a transaction by retrieving or depositing money. So that, the user has to specify the account number, the type of transaction (CREDIT or DEBIT) and the amount.
The amount to send there should be always positive. but in backend side it will come as a negative value for DEBIT or positive value for CREDIT. So that it can be used to add or substract the current_balance of the account.

Rules:
. The user can not make transactions with inactive accounts or accotuns that belongs to inactive clients. Otherwise a modal will open showing an error message.
. The user can not update tranasctions.
. The user can delete transactions, but the amount of the account has to be updated as well. (current_balance).
. if the current_balacne is cero. and the user is going to do a debit tranasction. A modal will open showing "balanace not available".
. There must be a daily limit of 1000$. So that the user can not withdraw more than 1000 on the same day. This parameter can be stored in a public constant in the backend code. when the user exced the limit, A modal will open showing "Daily quota exceeded".

When the user enters to report section. 
. Incluir un botón que permita descargar el reporte en formato PDF.

There will be a button to download a PDF that will contain all the tranasction information.
Generate the report by sepcifying a range of date and the client's name.
The pdg file will show the account numbers, the origina and current balance and the quantity of withdrasr and deposits as well.
I understand that the pdf content wil be generated by receibing base64 content after calling the backend api of ReportController.
. if some action finished (create, update, etc). a modal will open showing an error message of succes or error.
For example, to show the error when you create or update a client by setting an IDcard that already belongs to another one
. In the filter section there will be a control to indicate that the stard date should be less or equals than end date. Otherwise a modal will open showing an error message.

In don't care the color that you use as long as they match very well.
Use the front-end image as a reference. 
