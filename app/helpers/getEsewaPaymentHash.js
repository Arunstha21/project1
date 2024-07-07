
import CryptoJS from 'crypto-js'

const ESEWA_SECRET_KEY = "8gBm/:&EnhH.1/q";
const ESEWA_GATEWAY_URL = "https://rc-epay.esewa.com.np";
const ESEWA_PRODUCT_CODE = "EPAYTEST";

export async function GetEsewaPaymentHash( amount, transaction_uuid) {
  try {
    const data = `total_amount=${amount},transaction_uuid=${transaction_uuid},product_code=${ESEWA_PRODUCT_CODE}`;
    const secretKey = ESEWA_SECRET_KEY;

    const hash = CryptoJS.HmacSHA256(data, secretKey);
    const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

    return {
      signature: hashInBase64,
      signed_field_names: "total_amount,transaction_uuid,product_code",
    };
  } catch (error) {
    throw error;
  }
}


export async function VerifyEsewaPayment(encodedData) {
  try {
    // decoding base64 code revieved from esewa
    let decodedData = atob(encodedData);
    decodedData = await JSON.parse(decodedData);
    let headersList = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const data = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${ESEWA_PRODUCT_CODE},signed_field_names=${decodedData.signed_field_names}`;

    const secretKey = ESEWA_SECRET_KEY;
    const hash = CryptoJS.HmacSHA256(data, secretKey);
    const hashInBase64 = CryptoJS.enc.Base64.stringify(hash);

    if (hashInBase64 !== decodedData.signature) {
      throw { message: "Invalid Info", decodedData };
    }

    const response = await fetch(
      `${ESEWA_GATEWAY_URL}/api/epay/transaction/status/?product_code=${ESEWA_PRODUCT_CODE}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`,
      {
        method: "GET",
        headers: headersList,
      }
    );
    const res = await response.json();

    if (
      res.status !== "COMPLETE" ||
      res.transaction_uuid !== decodedData.transaction_uuid ||
      Number(res.total_amount) !== Number(decodedData.total_amount)
    ) {
      throw { message: "Invalid Info", decodedData };
    }
    return { response: response.data, decodedData };
  } catch (error) {
    throw error;
  }
}
