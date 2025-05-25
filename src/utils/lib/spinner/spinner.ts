import { Spinner as CliSpinner } from "cli-spinner";

const spinner = new CliSpinner({
    text: " %s",
    stream: process.stdout,
    
});

spinner.setSpinnerString("⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏");

export function startSpinner() {
    // spinner.setSpinnerTitle(` ${text} %s`);
    spinner.start();
}

export function stopSpinner(successMsg?: string) {
    spinner.stop(true);
    if (successMsg) console.log(successMsg);
}

export function failSpinner(failureMsg?: string) {
    spinner.stop(true);
    if (failureMsg) console.error(failureMsg);
}
