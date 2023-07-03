import subprocess
import time

def start_program():
    # Replace the following line with the command to start your Node.js program
    process = subprocess.Popen(["node", "skyblock-bot.mjs"], shell=True)
    return process

def check_program(process):
    # Check if the program is still running
    return process.poll() is None

if __name__ == "__main__":
    program_process = None

    while True:
        if program_process is None or not check_program(program_process):
            # Start the Node.js program and save the process
            program_process = start_program()

        # Adjust the sleep time (in seconds) according to your needs
        time.sleep(10)