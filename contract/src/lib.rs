#![no_std]
use soroban_sdk::{contract, contractimpl, log, symbol_short, vec, Env, Symbol, Vec, String, Address};

// Símbolos para roles y estados
const ADMIN: Symbol = symbol_short!("ADMIN");
const BORROWER: Symbol = symbol_short!("BORROWER");
const LENDER: Symbol = symbol_short!("LENDER");
const ACTIVE: Symbol = symbol_short!("ACTIVE");
const APPROVED: Symbol = symbol_short!("APPROVED");
const PAID: Symbol = symbol_short!("PAID");
const DEFAULTED: Symbol = symbol_short!("DEFAULTED");

#[contract]
pub struct RapidLoanContract;

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct User {
    pub address: Address,
    pub role: Symbol,
    pub name: String,
    pub credit_score: u32,
    pub created_at: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Loan {
    pub id: u32,
    pub borrower: Address,
    pub amount: i128,
    pub purpose: String,  // "vehicle", "equipment", "phone", "other"
    pub term_days: u32,
    pub interest_rate: u32,  // porcentaje anual
    pub status: Symbol,
    pub amount_remaining: i128,
    pub created_at: u64,
    pub due_date: u64,
    pub lender: Option<Address>,
}

#[contractimpl]
impl RapidLoanContract {
    
    // Inicializar contrato
    pub fn initialize(env: Env, admin: Address) {
        admin.require_auth();
        env.storage().instance().set(&ADMIN, &admin);
        log!(&env, "Contrato RapidLoan inicializado por:", admin);
    }

    // Registrar usuario como prestatario
    pub fn register_borrower(env: Env, user: Address, name: String, initial_score: u32) {
        user.require_auth();
        
        let user_data = User {
            address: user.clone(),
            role: BORROWER,
            name: name.clone(),
            credit_score: initial_score,
            created_at: env.ledger().timestamp(),
        };
        
        let user_key = Symbol::new(&env, &format!("USER_{}", user));
        env.storage().instance().set(&user_key, &user_data);
        
        log!(&env, "Prestatario registrado:", name, "Score:", initial_score);
    }

    // Solicitar préstamo
    pub fn request_loan(
        env: Env,
        borrower: Address,
        amount: i128,
        purpose: String,
        term_days: u32
    ) -> u32 {
        borrower.require_auth();
        
        // Verificar que es prestatario
        let user_key = Symbol::new(&env, &format!("USER_{}", borrower));
        if let Some(user_data) = env.storage().instance().get::<User>(&user_key) {
            if user_data.role != BORROWER {
                panic!("Solo prestatarios pueden solicitar préstamos");
            }
        }

        let loan_id = env.storage().instance().get(&symbol_short!("LOAN_COUNT")).unwrap_or(0) + 1;
        
        // Calcular tasa de interés basada en score crediticio
        let interest_rate = Self::calculate_interest_rate(env.clone(), borrower.clone());
        let due_date = env.ledger().timestamp() + (term_days * 24 * 60 * 60); // días a segundos

        let loan = Loan {
            id: loan_id,
            borrower: borrower.clone(),
            amount,
            purpose: purpose.clone(),
            term_days,
            interest_rate,
            status: ACTIVE,
            amount_remaining: amount,
            created_at: env.ledger().timestamp(),
            due_date,
            lender: None,
        };
        
        let loan_key = Symbol::new(&env, &format!("LOAN_{}", loan_id));
        env.storage().instance().set(&loan_key, &loan);
        env.storage().instance().set(&symbol_short!("LOAN_COUNT"), &loan_id);

        // Agregar a préstamos del usuario
        let user_loans_key = Symbol::new(&env, &format!("USER_LOANS_{}", borrower));
        let mut current_loans: Vec<u32> = env.storage().instance().get(&user_loans_key).unwrap_or_else(|| vec![&env]);
        current_loans.push_back(loan_id);
        env.storage().instance().set(&user_loans_key, &current_loans);
        
        log!(&env, "Préstamo solicitado - ID:", loan_id, "Monto:", amount, "Propósito:", purpose);
        loan_id
    }

    // Aprobar préstamo (lender)
    pub fn approve_loan(env: Env, lender: Address, loan_id: u32) {
        lender.require_auth();
        
        let loan_key = Symbol::new(&env, &format!("LOAN_{}", loan_id));
        let mut loan: Loan = env.storage().instance().get(&loan_key).unwrap();
        
        if loan.status != ACTIVE {
            panic!("Préstamo no disponible");
        }
        
        loan.status = APPROVED;
        loan.lender = Some(lender.clone());
        
        env.storage().instance().set(&loan_key, &loan);
        
        log!(&env, "Préstamo aprobado - ID:", loan_id, "Lender:", lender);
    }

    // Realizar pago
    pub fn make_payment(env: Env, borrower: Address, loan_id: u32, amount: i128) {
        borrower.require_auth();
        
        let loan_key = Symbol::new(&env, &format!("LOAN_{}", loan_id));
        let mut loan: Loan = env.storage().instance().get(&loan_key).unwrap();
        
        if loan.borrower != borrower {
            panic!("Solo el prestatario puede realizar pagos");
        }
        
        if loan.status != APPROVED {
            panic!("Préstamo no aprobado");
        }
        
        loan.amount_remaining -= amount;
        
        if loan.amount_remaining <= 0 {
            loan.status = PAID;
            // Mejorar score crediticio por pago completo
            Self::update_credit_score(env.clone(), borrower.clone(), true);
        }
        
        env.storage().instance().set(&loan_key, &loan);
        
        log!(&env, "Pago realizado - Préstamo:", loan_id, "Monto:", amount, "Restante:", loan.amount_remaining);
    }

    // Obtener detalles del préstamo
    pub fn get_loan(env: Env, loan_id: u32) -> Option<Loan> {
        let loan_key = Symbol::new(&env, &format!("LOAN_{}", loan_id));
        env.storage().instance().get(&loan_key)
    }

    // Obtener préstamos del usuario
    pub fn get_user_loans(env: Env, user: Address) -> Vec<Loan> {
        let user_loans_key = Symbol::new(&env, &format!("USER_LOANS_{}", user));
        let loan_ids: Vec<u32> = env.storage().instance().get(&user_loans_key).unwrap_or_else(|| vec![&env]);
        
        let mut loans = Vec::new(&env);
        for loan_id in loan_ids.iter() {
            if let Some(loan) = Self::get_loan(env.clone(), *loan_id) {
                loans.push_back(loan);
            }
        }
        loans
    }

    // Calcular tasa de interés basada en score
    fn calculate_interest_rate(env: Env, borrower: Address) -> u32 {
        let user_key = Symbol::new(&env, &format!("USER_{}", borrower));
        if let Some(user_data) = env.storage().instance().get::<User>(&user_key) {
            match user_data.credit_score {
                800..=1000 => 5,   // Excelente
                600..=799 => 8,    // Bueno
                400..=599 => 12,   // Regular
                _ => 15           // Riesgoso
            }
        } else {
            15 // Tasa por defecto para nuevos usuarios
        }
    }

    // Actualizar score crediticio
    fn update_credit_score(env: Env, user: Address, positive: bool) {
        let user_key = Symbol::new(&env, &format!("USER_{}", user));
        if let Some(mut user_data) = env.storage().instance().get::<User>(&user_key) {
            if positive {
                user_data.credit_score = (user_data.credit_score + 20).min(1000);
            } else {
                user_data.credit_score = user_data.credit_score.saturating_sub(30);
            }
            env.storage().instance().set(&user_key, &user_data);
        }
    }
}