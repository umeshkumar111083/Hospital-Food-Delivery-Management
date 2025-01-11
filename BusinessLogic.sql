-- 1. Users Table (For Authentication)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) CHECK (role IN ('hospital_manager', 'pantry_staff', 'delivery_personnel')) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Patients Table
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT CHECK (age >= 0) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('Male', 'Female', 'Other')) NOT NULL,
    disease TEXT,
    allergies TEXT,
    room_number INT NOT NULL,
    bed_number INT NOT NULL,
    floor_number INT NOT NULL,
    contact_phone VARCHAR(15) UNIQUE NOT NULL,
    emergency_contact_phone VARCHAR(15) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Diet Charts Table
CREATE TABLE diet_charts (
    id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(id) ON DELETE CASCADE,
    meal_time VARCHAR(20) CHECK (meal_time IN ('Morning', 'Evening', 'Night')) NOT NULL,
    ingredients TEXT NOT NULL,
    instructions TEXT DEFAULT '',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Pantry Staff Table
CREATE TABLE pantry_staff (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    location VARCHAR(255) NOT NULL,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Delivery Personnel Table
CREATE TABLE delivery_personnel (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(15) UNIQUE NOT NULL,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Meals Table (Tracks Meal Preparation)
CREATE TABLE meals (
    id SERIAL PRIMARY KEY,
    diet_chart_id INT REFERENCES diet_charts(id) ON DELETE CASCADE,
    pantry_staff_id INT REFERENCES pantry_staff(id) ON DELETE SET NULL,
    preparation_status VARCHAR(20) CHECK (preparation_status IN ('Pending', 'In Progress', 'Completed')) DEFAULT 'Pending',
    prepared_at TIMESTAMP DEFAULT NULL
);

-- 7. Deliveries Table (Tracks Meal Delivery)
CREATE TABLE deliveries (
    id SERIAL PRIMARY KEY,
    meal_id INT REFERENCES meals(id) ON DELETE CASCADE,
    delivery_personnel_id INT REFERENCES delivery_personnel(id) ON DELETE SET NULL,
    delivery_status VARCHAR(20) CHECK (delivery_status IN ('Pending', 'In Transit', 'Delivered')) DEFAULT 'Pending',
    delivered_at TIMESTAMP DEFAULT NULL,
    delivery_notes TEXT DEFAULT ''
);



CREATE OR REPLACE FUNCTION update_meal_preparation_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.preparation_status = 'Completed' THEN
        NEW.prepared_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER meal_preparation_trigger
BEFORE UPDATE ON meals
FOR EACH ROW
EXECUTE FUNCTION update_meal_preparation_status();

CREATE OR REPLACE FUNCTION update_delivery_status()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.delivery_status = 'Delivered' THEN
        NEW.delivered_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER delivery_status_trigger
BEFORE UPDATE ON deliveries
FOR EACH ROW
EXECUTE FUNCTION update_delivery_status();



ALTER TABLE diet_charts ADD CONSTRAINT unique_meal_time UNIQUE (patient_id, meal_time);

CREATE OR REPLACE FUNCTION assign_meal_to_staff(meal_id INT, pantry_staff_id INT)
RETURNS VOID AS $$
BEGIN
    UPDATE meals
    SET pantry_staff_id = pantry_staff_id, preparation_status = 'In Progress'
    WHERE id = meal_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION assign_delivery_task(meal_id INT, delivery_personnel_id INT)
RETURNS VOID AS $$
BEGIN
    INSERT INTO deliveries (meal_id, delivery_personnel_id, delivery_status)
    VALUES (meal_id, delivery_personnel_id, 'In Transit');
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_pending_deliveries()
RETURNS TABLE (
    delivery_id INT,
    meal_id INT,
    patient_name VARCHAR,
    room_number INT,
    delivery_status VARCHAR
) AS $$
BEGIN
    RETURN QUERY 
    SELECT d.id, d.meal_id, p.name, p.room_number, d.delivery_status
    FROM deliveries d
    JOIN meals m ON d.meal_id = m.id
    JOIN diet_charts dc ON m.diet_chart_id = dc.id
    JOIN patients p ON dc.patient_id = p.id
    WHERE d.delivery_status != 'Delivered';
END;
$$ LANGUAGE plpgsql;



TRUNCATE TABLE deliveries RESTART IDENTITY CASCADE;
TRUNCATE TABLE meals RESTART IDENTITY CASCADE;
TRUNCATE TABLE diet_charts RESTART IDENTITY CASCADE;
TRUNCATE TABLE patients RESTART IDENTITY CASCADE;
TRUNCATE TABLE pantry_staff RESTART IDENTITY CASCADE;
TRUNCATE TABLE delivery_personnel RESTART IDENTITY CASCADE;
TRUNCATE TABLE users RESTART IDENTITY CASCADE;


INSERT INTO users (email, password_hash, role) VALUES
('hospital_manager@xyz.com', 'hashed_password_1', 'hospital_manager'),
('hospital_pantry@xyz.com', 'hashed_password_2', 'pantry_staff'),
('hospital_delivery@xyz.com', 'hashed_password_3', 'delivery_personnel');


INSERT INTO patients (name, age, gender, disease, allergies, room_number, bed_number, floor_number, contact_phone, emergency_contact_phone) VALUES
('John Doe', 45, 'Male', 'Diabetes', 'Nuts', 302, 4, 3, '9876543210', '9123456789'),
('Jane Smith', 52, 'Female', 'Hypertension', 'Dairy', 204, 2, 2, '8765432109', '9012345678');


INSERT INTO diet_charts (patient_id, meal_time, ingredients, instructions) VALUES
(1, 'Morning', 'Oats, Almonds, Skim Milk', 'No sugar'),
(1, 'Evening', 'Grilled Chicken, Broccoli, Brown Rice', 'Low salt'),
(2, 'Night', 'Salmon, Steamed Vegetables, Quinoa', 'No dairy');


INSERT INTO pantry_staff (name, phone, location, user_id) VALUES
('Alice Brown', '9998887776', 'Kitchen A', 2),
('Bob Green', '8887776665', 'Kitchen B', NULL); -- No assigned user yet


INSERT INTO delivery_personnel (name, phone, user_id) VALUES
('Charlie White', '7776665554', 3),
('David Black', '6665554443', NULL); -- No assigned user yet

INSERT INTO delivery_personnel (name, phone, user_id) VALUES
('Charlie White', '7776665554', 3),
('David Black', '6665554443', NULL); -- No assigned user yet



INSERT INTO meals (diet_chart_id, pantry_staff_id, preparation_status) VALUES
(1, 1, 'Completed'),
(2, 1, 'In Progress'),
(3, 2, 'Pending');

INSERT INTO meals (diet_chart_id, pantry_staff_id, preparation_status) VALUES
(1, 1, 'Completed'),
(2, 1, 'In Progress'),
(3, 2, 'Pending');

INSERT INTO deliveries (meal_id, delivery_personnel_id, delivery_status) VALUES
(1, 1, 'Delivered'),
(2, 1, 'In Transit'),
(3, 2, 'Pending');


-- Step 1: Create the trigger function
CREATE OR REPLACE FUNCTION classify_user()
RETURNS TRIGGER AS $$
BEGIN
  -- If the role is 'pantry_staff', insert into the pantry_staff table
  IF NEW.role = 'pantry_staff' THEN
    INSERT INTO pantry_staff (name, phone, user_id)
    VALUES (NULL, NULL, NEW.id)
    ON CONFLICT (user_id) DO NOTHING; -- Avoid duplicate entries
  END IF;

  -- If the role is 'delivery_personnel', insert into the delivery_personnel table
  IF NEW.role = 'delivery_personnel' THEN
    INSERT INTO delivery_personnel (name, phone, user_id)
    VALUES (NULL, NULL, NEW.id)
    ON CONFLICT (user_id) DO NOTHING; -- Avoid duplicate entries
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Attach the trigger to the users table
DROP TRIGGER IF EXISTS classify_user_trigger ON users;

CREATE TRIGGER classify_user_trigger
AFTER INSERT OR UPDATE OF role
ON users
FOR EACH ROW
EXECUTE FUNCTION classify_user();



DELETE FROM users
WHERE id IN (4, 5, 6);


DROP TRIGGER IF EXISTS classify_user_trigger ON users;


DROP FUNCTION IF EXISTS classify_user();

ALTER TABLE users
ADD COLUMN name VARCHAR(255),
ADD COLUMN phone VARCHAR(20),
ADD COLUMN location VARCHAR(255);


CREATE OR REPLACE FUNCTION insert_pantry_staff()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'pantry_staff' THEN
    INSERT INTO pantry_staff (name, phone, location, user_id)
    VALUES (NEW.name, NEW.phone, NEW.location, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_insert_pantry_staff
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION insert_pantry_staff();


CREATE OR REPLACE FUNCTION insert_delivery_personnel()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.role = 'delivery_personnel' THEN
    INSERT INTO delivery_personnel (name, phone, user_id)
    VALUES (NEW.name, NEW.phone, NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_insert_delivery_personnel
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION insert_delivery_personnel();


DROP TRIGGER IF EXISTS trg_insert_pantry_staff ON users;
DROP TRIGGER IF EXISTS trg_insert_delivery_personnel ON users;


DROP FUNCTION IF EXISTS insert_pantry_staff();
DROP FUNCTION IF EXISTS insert_delivery_personnel();



-- Function to handle user insertions for delivery_personnel and pantry_staff
CREATE OR REPLACE FUNCTION handle_user_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into delivery_personnel if role is delivery_personnel
  IF NEW.role = 'delivery_personnel' THEN
    INSERT INTO delivery_personnel (name, phone, user_id)
    VALUES (NEW.name, NEW.phone, NEW.id);
  END IF;

  -- Insert into pantry_staff if role is pantry_staff
  IF NEW.role = 'pantry_staff' THEN
    INSERT INTO pantry_staff (name, phone, location, user_id)
    VALUES (NEW.name, NEW.phone, NEW.location, NEW.id);
  END IF;

  -- No action for other roles
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger on the users table
CREATE TRIGGER trigger_user_insert
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION handle_user_insert();


DROP TRIGGER IF EXISTS trigger_user_insert ON users;
DROP FUNCTION IF EXISTS handle_user_insert();


ALTER TABLE users ADD COLUMN detailsFilled BOOLEAN DEFAULT FALSE;

ALTER TABLE users
DROP COLUMN IF EXISTS name,
DROP COLUMN IF EXISTS phone,
DROP COLUMN IF EXISTS location;
