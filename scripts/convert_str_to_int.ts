

const rl = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  })

function shortStringToBigInt(convertableString: string) {
    const invalidChars: { [key: string]: boolean } = {};
    const charArray: any = [];
    for (const c of convertableString.split("")) {
        const charCode = c.charCodeAt(0);
        if (charCode > 127) {
            invalidChars[c] = true;
        }
        charArray.push(charCode.toString(16));
    }

    return BigInt("0x" + charArray.join(""));
}

async function main() {
   
    let str : string = await input('Enter name: ')
    console.log("INT= ", shortStringToBigInt(str))
    rl.close()
}
  
  
function input(prompt: string) {

    return new Promise<string>((callbackFn, errorFn) => {
        rl.question(prompt, (uinput: string) => {
            callbackFn(uinput)
          })
      })
    // const str : string = await rl.question(prompt, (uinput: string) => uinput);
    // return BigInt(str)
}
  
  main()
  