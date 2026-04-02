const fs = require("fs");

// === your functions from before ===
function base64Decode(str) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=";
  let out = "", buffer = 0, bits = 0;
  for (let ch of str) {
    if (ch === "=") break;
    const val = chars.indexOf(ch);
    if (val === -1) continue;
    buffer = (buffer << 6) | val;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out += String.fromCharCode((buffer >> bits) & 0xff);
    }
  }
  return decodeURIComponent(out.split("").map(c =>
    "%" + c.charCodeAt(0).toString(16).padStart(2, "0")).join(""));
}

function rc4(data, key) {
  data = base64Decode(data);
  let s = Array.from({ length: 256 }, (_, i) => i);
  let j = 0;
  for (let i = 0; i < 256; i++) {
    j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
    [s[i], s[j]] = [s[j], s[i]];
  }
  let i = 0; j = 0; let res = "";
  for (let c of data) {
    i = (i + 1) % 256;
    j = (j + s[i]) % 256;
    [s[i], s[j]] = [s[j], s[i]];
    const k = s[(s[i] + s[j]) % 256];
    res += String.fromCharCode(c.charCodeAt(0) ^ k);
  }
  return res;
}

// === load your data ===
// const arr = [ /* paste the long array from function _() */ ];
const arr = ["ySo4WQm", "WPddMmoPqWm", "WRVcGNldPSke", "WQbkW6mfuG", "W4/dJCk3CSoi", "W5RdNmkPoNe", "W57dH8o9W6ldSG", "cSkcWPBcObO", "W6DJDSkjAW", "csfpmCop", "urvoabG", "W5XCnW", "WOyrmSkxiW", "C8oSySkCWOy", "W7RdHmoaW5ZdQq", "W43dU8onW5VdPq", "W754W4/dJsW", "W7umW40hWPW", "w8kAWRhdVCo5", "hCk7W5HcW6C", "WPlcR8o6qNC", "s8kaWQZcLh0", "gCoMWOfBW48", "xWzB", "vSkkWPtcRf8", "maVdRWfd", "WQawtKfw", "W5hdRCkYzZO", "W4CDW7OoW5S", "W6tcMf/cOmkp", "fSkZxmo5WOa", "ug7cOa", "w1xcQ3qsWOBdG8odvCoXW7u", "WPZcLSkil8kd", "v8oeySk4WOu", "W5zyW6FdNba", "C8o1BSkaWOe", "u8oPFSkg", "r8kNWOZcVwK", "WO1KqCk0", "W7xdQ8o6", "agXHorm", "W6RdT8kPEHa", "W7dcNK3cQmkP", "sCkLfeG", "WRy6mmkxlq", "WPBcNCkmpCkM", "DxXwoYe", "emkVDmoKWOS", "WO/cP0xdM8k0", "mCkOWRdcIqq", "avdcS1hdUG", "fcreefi", "fHNdRIK", "WOFcVSkOamkl", "v8k4feqI", "WR7dOfxdMW8", "W5/dImk5CSoF", "W4xcScpcTLWYW687emotvSo/W4C", "qCkqWRxcQKG", "WQqJre9O", "WOJcLhZdOCkD", "m8k5WPRcVaC", "WRhdISoVAtu", "FmoCWPS1WRq", "W6JdHtJdQ2O", "WRFdL3hdGX4", "WOVdSmomkIW", "WRW6qtVcUa", "mtTLgK8", "Fmo0W4/dRSkP", "W5CrW5CeWPe", "WOrmW7G", "W7n1c8kvWRS", "WRFdKLhdStC", "W63dImoiWRy", "W6XoWQZdJ0e", "W4BdPmkekKlcHapdKmoSW4fnd8kKWRW", "W6VdOSoRWPVcLq", "W5ZcTKlcKmkn", "FSoyW7NdICkk", "rmoUxCkTWRK", "W6CUW5O6WRO", "omk4W57dSJi", "W6RdR8o6W5RdHG", "WRbfW7RdGSoz", "W6iTW5WfW78", "rCkMeKKL", "W6ZdOSoVW5G", "W6tdMmkRrIe", "WPlcI8kWgSkG", "W7nxWQRdRga", "W6RdHSor", "W6FdUmk0wce", "rqH5yCkT", "W7jZySk5AW", "yCohWOK2WPm1W7hcR2KbEsBcLmox", "W6nJW4pdLaK", "sCoyFSkVWOu", "W7bcWQRdTMS", "W4jVW6m", "xepcRWdcOa", "W4hdLSoVWQfT", "W7m2W5KIW70", "WQfjW6i", "W7XGDW", "vsLoxCkS", "W6vrW7a", "bmonWPW", "W4NdKCkjWRbc", "u11JlHW", "WR5oW5hdNG", "WRa+W6DJWOK", "vWFdOadcOCkpkCovW6hdHsK", "W53dP8kIwSoq", "W7tdJc/dHG", "yCofW7j2WRG", "WQ7cSmkQlSk+", "W6xdL8k4wmop", "W6vGq8kEFa", "W4ddMmk6WOnf", "WQiOwMPM", "c8kWWO7cOsq", "W4zVW77dKay", "i8kIDSoVWQq", "f8o4sHi6WQpdS0q3Dq", "W4tdUCkZWPfg", "WRvbW6e0zq", "W5lcNLRcQmkK", "uq9cdqG", "W41cWQZdRq", "gmonWOLaW54", "W4H3v8k6", "xcJdTW3cQq", "gmkDWPNcLJu", "WQxcJmkzcmkK", "W4C4W5eAWPe", "ec5Ejum", "waHcdW", "WQdcNCoQBsa", "WPRcM0xdSSka", "qqnB", "n1JcTNVdPG", "zCo0W7HdWOG", "W6xdLGNdH2S", "W6r3iCk/WOO", "WOtcSSoc", "WQldKSonxJu", "WOziWQzwWPZdNSkQlLFcKSk3W6b8", "j1ZcOq", "W6NdII0", "wWLm", "mmkwW4TJW4i", "WQeDW4nEWQq", "W6nxW5W", "nmksW4TdW4u", "iCkHBCoaWQ0", "W7VdPSoLW4xdGG", "vZ58zmkd", "e8k9WRmPW74", "WPzoWPnDW4tcQftdPmo7cSoIpcG", "W5DmCmkmsG", "W5yzW6mcW4u", "oSk9WPmFW4q", "W4BdKstdI3e", "W5nsi8kK", "W4yrW4WjWPq", "W7jTAmkREG", "bc3dJXLw", "BSosWQeEWRu", "W53cU2tcKCkz", "WPC/yq", "dSo8W73cN8kDW7alvh3cMSk2W5hcIq", "WRldRSoQuYS", "dXRdTqTw", "A8k9WRlcIeS", "W7lcS8koeZqqW43cQSoTWRe", "jZDDjxi", "W63dMmkGrIu", "W6pdLI/dIxe", "vYnkfq0", "W5tdK8oLW7tdKG", "rSo1FSkgWRa", "WQWXW7vIWRG", "WOe1zq", "EMJcPGFcOG", "W7hdUCoiW7xdLa", "wg7cRGtcRq", "WRzuzSkuCa", "WOqtx1n7", "ftnFpa", "x8oWDSk4WOe", "WQO3EtNcNq", "pf3cNNddRq", "W4JdO8kvCca", "AmkOWRddNSoO", "iSoJWOPJW4W", "iSoaWOj1WPi", "W6hcQe7cGCks", "xmogEmkHWQm", "ma/cSKRdIa", "W5zOlSkWWOm", "W4vZW4ddMmo+", "z8ocWOPVW55+WPhdQLK", "zCo0WQiFWR0", "WPpcQmo/sq", "W6BdICoiWRv1", "W5ZdQ8o+W5m", "kSkqW4ddIai", "W5nKW6tdIq", "W5xdO8ktDIy", "cCkxWPpcLt0", "WR3cHMRdPmkd", "qCkxWR7cQfK", "WR9tW6VdQCo7", "W5PyW5xdHSoQ", "W5BdT8kdzYq", "WQRcT3RdOmkK", "WPtcQmkSdmk5", "W6tdImopWRT1", "pCkQWQ4EW7G", "fmkDWQBcKLuPCq", "WRWgWPRcM8kdW6FdRmobWQdcKsz1W7il", "W58SW6OKWR4", "WRSMBa", "k8kpW5JdGai", "WR/cI8o8CNK", "W70/W7akW4G", "A8kgWPddNmo7", "W5rYiCk7WOK", "W4hdI8kWohC", "WPyZWQhcJfpcP8oriGyLsbZdGu4", "W47dMmkRD8oD", "vYLjmGO", "WRuwW5X7WQy", "FYfEaWi", "WOykDq/cMa", "oSkbWO/cMZ4", "mCktBCoJWPS", "WP0cChzA", "W5yuW7GsW4G", "d8kyW7VdKXW", "ySkRd1yH", "zCkNWQVdQCoE", "mqX9awu", "WOhcV8kNiCki", "W5emW4meWOy", "W4ldNCk4WPro", "W5ldKSkS", "W7jvjSkZWOi", "v0nWjby", "ESkJWQpdUSoO", "W65XBKzmE8oajW", "WOZdISkVWPXc", "WRC+Fr3cVa", "WPVcMKZdV8ky", "oSkpW4ddJGq", "WOpdTNBdSHa", "W7npWRhdPMS", "WRzBWRNdJ3BcUha", "W7hcMu7cR8k4", "WPeOAdxcIW", "W6ZdPCozW4ldLq", "drHjl8of", "WQRcU8k/WOpcLYfymSkZWRPAWR7dRW", "WR/cVwldNCk0", "gHTGnCoy", "Dmk5m04E", "r8kVgG8", "W6HmWPxdLMS", "vSozW4LYWPO", "W4ddJmkdqc4", "fCktWO0JW4a", "WRaOBM4", "WOe7W7r+WRK", "b1qCvLtdVWpcJ8o0uKPKWPm", "W5TnWRNdQgS", "gL3cHKZdPW", "WPqPFGZcSa", "b1ZcSG", "ibTcoCot", "rqjzbaq", "wGFdOfFdOCkDk8oVW4m", "W4rOACkSla", "ASooW6u", "W53dMSkupxS", "W7BdKSoeWQPT", "ACoUESkjWRq", "W5XGW7ZdImot", "jCkgDSoM", "WRjes8k5uW", "dCkZWORcGZu", "W6v7W4ldTG4", "WPlcGKFdQCku", "WQqOAgjQ", "eahdScHj", "u8o0uCkcWQK", "A8obW41fW7H3WQddNq", "WOtcPSoECGi", "W5GzW6C", "W4HXW67dLZy", "WP57ACkjxq", "WQldQmoEqIO", "cCk9WO3cStW", "fG9saKa", "lSk9CmoPWPO"];
const code = fs.readFileSync("synth.js", "utf8");

// find all e(NUMBER, "KEY") calls
const pattern = /e\((\d+),\s*"([^"]+)"\)/g;
let match;
while ((match = pattern.exec(code)) !== null) {
  const index = parseInt(match[1]) - 206;
  const key = match[2];
  const data = arr[index];
  if (!data) continue;
  try {
    const dec = rc4(data, key);
    if (/^[\x20-\x7E\s]{3,}$/.test(dec)) { // printable ASCII
      console.log(`${match[0]} => "${dec}"`);
    }
  } catch (err) {}
}
