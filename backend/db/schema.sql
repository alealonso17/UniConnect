DROP DATABASE IF EXISTS uniConnect_db ; 
	CREATE DATABASE uniConnect_db ; 
USE uniConnect_db; 


-- ===========================
--  USERS
-- ===========================
 CREATE TABLE users (
	user_id INT AUTO_INCREMENT ,
    user_handle VARCHAR(50) NOT NULL UNIQUE, 
    email_address VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phonenumber VARCHAR(15) UNIQUE,
    bio TEXT,
	profile_picture VARCHAR(255),             
    banner_picture VARCHAR(255), 
    created_at TIMESTAMP NOT NULL DEFAULT(NOW()),
    updated_at TIMESTAMP DEFAULT(CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
    admin_status BOOLEAN NOT NULL DEFAULT(FALSE),
    
    -- KEYS 
    PRIMARY KEY(user_id),
    
    -- CONSTRAINS 
    CONSTRAINT handle_no_spaces CHECK (user_handle NOT LIKE '% %'),                -- no spaces 
    CONSTRAINT handle_length CHECK (CHAR_LENGTH(user_handle) >= 3),                -- min 3 CHAR
    CONSTRAINT email_format CHECK (email_address LIKE '%@%' AND email_address LIKE '%.%'),  -- simple email format 
    CONSTRAINT phone_numeric CHECK (phonenumber REGEXP '^[0-9+]+$' OR phonenumber IS NULL), -- only numbers or "+" 
    CONSTRAINT name_length CHECK (CHAR_LENGTH(first_name) >= 2 AND CHAR_LENGTH(last_name) >= 2), -- normal names 
    CONSTRAINT bio_length CHECK (bio IS NULL OR CHAR_LENGTH(bio) <= 500),          -- bio max  500 chars
    CONSTRAINT admin_boolean CHECK (admin_status IN (0,1))                    -- only true or false 

    ) ; 
    
    
    
-- ===========================
--  FOLLOWERS
-- ===========================


CREATE TABLE followers (
	follower_id INT NOT NULL ,
    following_id INT NOT NULL ,
    following_since TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- KEYS 
    PRIMARY KEY(follower_id, following_id),
    FOREIGN KEY (follower_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE
    

	);


-- ===========================
--  POSTS
-- ===========================

CREATE TABLE posts (
	post_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    post_text VARCHAR(280) NOT NULL,
    num_likes INT DEFAULT 0,
    num_comments INT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT(CURRENT_TIMESTAMP),
    image_path VARCHAR(255),
	visibility ENUM('public', 'friends', 'private') DEFAULT 'public',
    
    
    -- KEYS 
    PRIMARY KEY (post_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ,
    
    -- CONSTRAINTS 
	CONSTRAINT post_length CHECK (CHAR_LENGTH(post_text) BETWEEN 1 AND 500),  
    CONSTRAINT like_count_nonnegative CHECK (num_likes >= 0),
    CONSTRAINT comment_count_nonnegative CHECK (num_comments >= 0)
    
);  


-- ===========================
--  REPOSTS
-- ===========================

CREATE TABLE reposts ( 
	repost_id INT NOT NULL AUTO_INCREMENT,
	reposted_by INT NOT NULL , 
    reposted_post INT NOT NULL,
    repost_at TIMESTAMP NOT NULL DEFAULT(CURRENT_TIMESTAMP),
    
    -- KEYS 
    PRIMARY KEY (repost_id),
    FOREIGN KEY (reposted_by) REFERENCES users(user_id),
    FOREIGN KEY (reposted_post) REFERENCES posts(post_id) ,
    
    -- CONSTRAINT 
    CONSTRAINT no_double_repost
			UNIQUE(reposted_by, reposted_post)
    
); 


-- ===========================
--  LIKES
-- ===========================
CREATE TABLE likes (
    like_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- KEYS 
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    
    -- CONSTRAINS 
    CONSTRAINT no_double_like 
			UNIQUE (user_id, post_id)
);


-- ===========================
--  COMMENTS
-- ===========================

CREATE TABLE comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- KEYS 
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    -- CONSTRAINT 
     CONSTRAINT comment_length CHECK (CHAR_LENGTH(content) BETWEEN 1 AND 500)
);



INSERT INTO users (user_handle, email_address, password_hash, first_name, last_name, phonenumber, bio, profile_picture, banner_picture, admin_status) VALUES (
    'alealonso',
    '2alejandroalonso@gmail.com',
    '$2b$10$.zx338cnBfprH10tCQ1lduF3L6as9MI3zuSKEIgofEZnKxHvztFAG',
    'Alejandro',
    'Alonso',
    '+34664395270',
    'Software developer passionate about web technologies, creator of UniConnect.',
    '/public/images/profile/alealonso.png',
    '/public/images/banner/alealonso_banner.png',
    TRUE
);


CREATE INDEX idx_user_handle ON users(user_handle);
CREATE INDEX idx_user_email ON users(email_address);
CREATE INDEX idx_post_userid ON posts(user_id);
CREATE INDEX idx_follow_follower ON followers(follower_id);

