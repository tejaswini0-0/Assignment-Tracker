from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import os


def login(driver, wait, username, password, is_teacher=False):
    driver.get("http://localhost:5173/")
    time.sleep(2)

    if is_teacher:
        print("[INFO] Clicking Teacher button to switch role...")
        teacher_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Teacher')]")))
        teacher_button.click()
        time.sleep(2)

    print(f"[INFO] Logging in with Username: '{username}', Password: '{password}'")
    placeholder = "teacher1" if is_teacher else "student1"
    try:
        username_input = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, f'input[placeholder="{placeholder}"]')))
        username_input.clear()
        username_input.send_keys(username)

        password_input = driver.find_element(By.CSS_SELECTOR, 'input[placeholder="Use \'password\' for demo"]')
        password_input.clear()
        password_input.send_keys(password)

        submit_button = driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]')
        time.sleep(1)
        submit_button.click()
        print("[INFO] Login submitted.")
        time.sleep(5)
    except Exception as e:
        print(f"[ERROR] Failed to login for user {username}: {e}")


def submit_assignment(driver, wait, file_path):
    print("[INFO] Submitting assignment...")

    # Wait and click the first assignment link
    wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "a[href^='/assignment/']")))
    first_assignment = driver.find_element(By.CSS_SELECTOR, "a[href^='/assignment/']")
    first_assignment.click()
    time.sleep(3)

    # Validate file type and size
    if not file_path.lower().endswith('.pdf'):
        print("[ERROR] File must be a PDF.")
        return

    file_size_mb = os.path.getsize(file_path) / (1024 * 1024)
    if file_size_mb > 50:
        print(f"[ERROR] File exceeds 50 MB. Current size: {file_size_mb:.2f} MB")
        return

    wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='file']")))
    file_input = driver.find_element(By.CSS_SELECTOR, "input[type='file']")

    # Upload file
    file_input.send_keys(file_path)
    time.sleep(2)

    # Check number of uploaded files via input field
    uploaded_files = driver.execute_script("return document.querySelector('input[type=file]').files.length")
    if uploaded_files != 1:
        print(f"[ERROR] Expected 1 file, but found {uploaded_files}.")
        return

    # Submit the assignment
    submit_button = wait.until(EC.element_to_be_clickable(
        (By.XPATH, "//button[@type='submit' and contains(text(),'Submit Assignment')]")))
    submit_button.click()
    print("[INFO] Assignment submitted.")
    time.sleep(3)


def sign_out(driver, wait):
    print("[INFO] Attempting to sign out...")
    try:
        sign_out_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[contains(text(),'Sign out')]")))
        sign_out_button.click()
        time.sleep(2)
        print("[INFO] Sign out successful.")
    except Exception as e:
        print(f"[INFO] Skipped sign out (maybe not logged in): {e}")


def run_black_box_tests(driver, wait):
    print("\n=== Running Black Box Testing ===\n")

    print("[BVT] Valid usernames, correct password")
    for user in ["student1", "student2"]:
        login(driver, wait, user, "password", is_teacher=False)
        sign_out(driver, wait)

    for user in ["teacher1", "teacher2"]:
        login(driver, wait, user, "password", is_teacher=True)
        sign_out(driver, wait)

    print("[BVT] Invalid usernames")
    for invalid_user in ["student3", "teacher3", ""]:
        login(driver, wait, invalid_user, "password")
        sign_out(driver, wait)

    print("[BVT] Empty password")
    login(driver, wait, "student1", "")
    sign_out(driver, wait)

    print("[BVT] Incorrect password")
    login(driver, wait, "teacher1", "wrongpass", is_teacher=True)
    sign_out(driver, wait)

    print("\n[ECP] Valid username & valid password")
    login(driver, wait, "student2", "password")
    sign_out(driver, wait)

    print("[ECP] Valid username & invalid password")
    login(driver, wait, "teacher2", "123456", is_teacher=True)
    sign_out(driver, wait)

    print("[ECP] Invalid username & any password")
    login(driver, wait, "invalidUser", "password")
    sign_out(driver, wait)

    print("[ECP] Empty username & any password")
    login(driver, wait, "", "password")
    sign_out(driver, wait)

    print("[ECP] Username with special characters")
    login(driver, wait, "student!", "password")
    sign_out(driver, wait)

    print("\n[Decision Table] Testing valid and invalid combinations")
    test_cases = [
        ("student1", "password", False),
        ("student2", "password", False),
        ("teacher1", "password", True),
        ("teacher2", "password", True),
        ("student1", "wrongpass", False),
        ("teacher1", "", True),
        ("", "password", False),
        ("invalidUser", "password", False),
    ]

    for username, pwd, is_teacher_flag in test_cases:
        try:
            login(driver, wait, username, pwd, is_teacher_flag)
            sign_out(driver, wait)
        except Exception as e:
            print(f"[WARN] Exception during test case (user={username}, pwd={pwd}, teacher={is_teacher_flag}): {e}")


def run_tests(driver, wait):
    print("Test UI element presence and login")
    login(driver, wait, "student1", "password")
    print("Dashboard loaded, checking UI elements...")
    sign_out(driver, wait)

    print("Testing login branches (student, teacher, failure)")
    print("Student login branch")
    login(driver, wait, "student2", "password")
    sign_out(driver, wait)

    print("Teacher login branch")
    login(driver, wait, "teacher2", "password", is_teacher=True)
    sign_out(driver, wait)

    print("Login failure branch")
    login(driver, wait, "student1", "wrongpassword")
    sign_out(driver, wait)

    print("Testing full paths in app")
    login(driver, wait, "student1", "password")

    # === Assignment Submission Test Cases ===

    print("\n[TEST CASE 1] Valid PDF < 50MB")
    submit_assignment(driver, wait, r"C:\\Users\\tejas\\Desktop\\Assignment Tracker\\sample_assignment.pdf")
    sign_out(driver, wait)
    login(driver, wait, "student1", "password")

    print("\n[TEST CASE 2] Not a PDF")
    submit_assignment(driver, wait, r"C:\\Users\\tejas\\Desktop\\Assignment Tracker\\not_a_pdf.txt")
    sign_out(driver, wait)
    login(driver, wait, "student1", "password")

    print("\n[TEST CASE 3] File > 50MB")
    submit_assignment(driver, wait, r"C:\\Users\\tejas\\Desktop\\Assignment Tracker\\large_file.pdf")
    sign_out(driver, wait)
    login(driver, wait, "student1", "password")

    print("\n[TEST CASE 4] Upload no file")
    submit_assignment(driver, wait, r"")
    sign_out(driver, wait) 
    login(driver, wait, "student1", "password")

    print("\n[TEST CASE 5] Upload multiple files")
    print("[WARNING] Skipping simulated multi-file input (not natively supported via standard HTML input)")

    sign_out(driver, wait)

    print("\nTeacher dashboard checks")
    login(driver, wait, "teacher1", "password", is_teacher=True)
    sign_out(driver, wait)

    login(driver, wait, "teacher2", "wrongpass", is_teacher=True)
    sign_out(driver, wait)

    login(driver, wait, "teacher2", "password", is_teacher=True)
    sign_out(driver, wait)



def main():
    chrome_options = Options()
    chrome_options.add_argument("--start-maximized")

    driver = webdriver.Chrome(options=chrome_options)
    wait = WebDriverWait(driver, 15)

    try:
        #run_black_box_tests(driver, wait)
        run_tests(driver, wait)
    finally:
        driver.quit()


if __name__ == "__main__":
    main()