async function errorHandler(promise, thisArg = null, ...args) {
  let data;
  try {
    data = await promise.apply(thisArg, args);
    return [data, null];
  } catch (e) {
    return [null, e];
  }
}

async function connSensitiveHandler(...args) {
  let [response, error] = await errorHandler(fetch, null, ...args);
  while (error) {
    console.log("retry, args:", ...args);
    if (error.cause.code === "ECONNRESET" || error.cause.code === "ETIMEDOUT") {
      console.log("zejabny net");
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
    [response, error] = await errorHandler(fetch, null, ...args);
  }
  return [response, null];
}

export { errorHandler, connSensitiveHandler };

// Jak używać tej funkcji?

// [zwróconaWartość, error] = await errorHandler(nazwaFunkcjiBezNawiasów, klasaDoKtórejFunkcjaNależy, argumentyWwolnejPostaci)
// Jeśli funkcja pójdzie pomyślnie, error będzie równy null
// Jeśli funkcja się nie powiedzie, zwróconaWartość będzie równa null

// Przykład:

// async function fetchData(username, email) {
//   try {
//     const response = await fetch("/api/login", {
//       method: "POST",
//       body: JSON.stringify({ username, email }),
//     });
//     return await response.json();
//   } catch (e) {
//     throw e;
//   }
// }

// async function main() {
//   const username = "cani";
//   const email = "cani123@gmail.com";
//   const [data, error] = errorHandler(
//     fetchData,
//     null /* funckja fetchData nie należy do żadnej klasy */,
//     username,
//     email
//   );
//   if (error) {
//     throw error;
//   }
//   console.log(data);
// }

// main();
