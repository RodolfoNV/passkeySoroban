
use soroban_sdk::{Bytes, Env};

const ALPHABET: &[u8] = b"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

pub fn decode(env: &Env, base64_url: &Bytes) -> Result<Bytes, &'static str> {
    let mut output = Bytes::new(env);
    let input = base64_url.to_vec();
    
    if input.is_empty() {
        return Ok(output);
    }

    
    let input_len = input.len();
    let mut actual_len = input_len;
    
    
    while actual_len > 0 && input.get(actual_len - 1) == Some(&(b'=' as u32)) {
        actual_len -= 1;
    }

    let mut acc = 0u32;
    let mut acc_len = 0u32;
    
    for i in 0..actual_len {
        let byte = input.get(i).ok_or("Invalid input")? as u8;
        let val = decode_char(byte)?;
        
        acc = (acc << 6) | (val as u32);
        acc_len += 6;
        
        if acc_len >= 8 {
            acc_len -= 8;
            let byte_val = (acc >> acc_len) & 0xFF;
            output.push_back(byte_val);
        }
    }
    
    Ok(output)
}

fn decode_char(byte: u8) -> Result<u8, &'static str> {
    match byte {
        b'A'..=b'Z' => Ok(byte - b'A'),
        b'a'..=b'z' => Ok(byte - b'a' + 26),
        b'0'..=b'9' => Ok(byte - b'0' + 52),
        b'-' => Ok(62),
        b'_' => Ok(63),
        _ => Err("Invalid base64url character"),
    }
}