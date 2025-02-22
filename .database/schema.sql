CREATE TABLE IF NOT EXISTS info (
    uid INTEGER PRIMARY KEY,
    email TEXT NOT NULL,
    fname TEXT NOT NULL,
    lname TEXT NOT NULL,
    dob TEXT,
    doj TEXT
);
INSERT INTO info (uid, email, fname, lname, dob, doj) VALUES 
(1, 'ecrawford4@ewu.edu', 'Ethan', 'Crawford', '01-26-2001', '02-12-2025');
CREATE TABLE IF NOT EXISTS admin (
    uid INTEGER PRIMARY KEY,
    email TEXT NOT NULL,
    hashpass TEXT NOT NULL
);
INSERT INTO admin (uid, email, hashpass) VALUES 
(1, 'ecrawford4@ewu.edu', 'password');