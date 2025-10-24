async function testAPI() {
    try {
        const response = await fetch('/test');
        const data = await response.json();
        document.getElementById(
            'result'
        ).innerHTML = `<strong>API Response:</strong> ${JSON.stringify(
            data,
            null,
            2
        )}`;
    } catch (error) {
        document.getElementById(
            'result'
        ).innerHTML = `<strong>Error:</strong> ${error.message}`;
    }
}
