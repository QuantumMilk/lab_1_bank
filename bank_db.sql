CREATE DATABASE Bank;
USE Bank;

CREATE TABLE Individuals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    middle_name VARCHAR(50),
    passport VARCHAR(20),
    inn VARCHAR(20),
    snils VARCHAR(20),
    drivers_license VARCHAR(20),
    additional_documents TEXT,
    notes TEXT
);

INSERT INTO individuals (id, first_name, last_name, middle_name, passport, inn, snils, drivers_license, additional_documents, notes)
                           VALUES (1, 'Иван', 'Иванов', 'Иванович', '1234567890', '123456789012', '123-456-789 00', '1234567890', 'Нет', 'Нет')

CREATE TABLE Loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    individual_id INT,
    amount DECIMAL(15, 2),
    interest_rate DECIMAL(5, 2),
    term INT,
    conditions TEXT,
    notes TEXT,
    FOREIGN KEY (individual_id) REFERENCES Individuals(id)
);

CREATE TABLE OrganizationLoans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT,
    individual_id INT,
    amount DECIMAL(15, 2),
    term INT,
    interest_rate DECIMAL(5, 2),
    conditions TEXT,
    notes TEXT,
    FOREIGN KEY (individual_id) REFERENCES Individuals(id)
);


CREATE TABLE Borrowers (
    borrower_id INT AUTO_INCREMENT PRIMARY KEY,
    inn VARCHAR(12),
    is_legal_entity BOOLEAN,
    address TEXT,
    amount DECIMAL(15, 2),
    conditions TEXT,
    legal_notes TEXT,
    contract_list TEXT
);

ALTER TABLE Loans
ADD COLUMN borrower_id INT,
ADD FOREIGN KEY (borrower_id) REFERENCES Borrowers(borrower_id);

ALTER TABLE OrganizationLoans
ADD COLUMN borrower_id INT,
ADD FOREIGN KEY (borrower_id) REFERENCES Borrowers(borrower_id);