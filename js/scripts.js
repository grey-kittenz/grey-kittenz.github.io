async function hexdigest(message, algorithm) {
    const encodedMsg = new TextEncoder().encode(message);
    const hashBuf = await crypto.subtle.digest(algorithm, encodedMsg);
    const hashArr = Array.from(new Uint8Array(hashBuf));
    return hashArr.map(b => b.toString(16).padStart(2, '0')).join('');
}

function checkHash() {
    document.getElementById("result").className = "";
    let fullname = document.getElementById("firstname").value + document.getElementById("lastname").value;
    fullname = fullname.normalize("NFKD");
    fullname = fullname.replace(/[\u0300-\u036F]/g, "");
    fullname = fullname.replace(/[^A-Za-z]/g, "");
    fullname = fullname.replace(/\s/g, "");
    fullname = fullname.toLowerCase();

    let bdsv = document.getElementById("bdsv").value;
    bdsv = bdsv.replace(/[^0-9\.]/g, "");

    let candidate = fullname;
    if (bdsv.length > 0) {
        candidate += ";"
        candidate += bdsv;
    }
    // console.log(candidate);

    const hashcalc = hexdigest(candidate, "SHA-512");
    Promise.resolve(hashcalc).then(function(value) {
        // console.log(value);
        document.getElementById("result").classList.add("alert", "mt-5", "mb-5");
        if (hashes["visa"].includes(value)) {
            document.getElementById("result").classList.add("alert-danger");
            document.getElementById("result").textContent = "Ihre Daten sind höchstwahrscheinlich im Leak enthalten.";
        } else {
            document.getElementById("result").classList.add("alert-success");
            document.getElementById("result").textContent = "Ihre Daten sind nicht im Leak enthalten.";
        }
    });
}

Array.from(document.getElementById("form").elements).forEach((input) => input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("submitButton").click();
    }
}));
