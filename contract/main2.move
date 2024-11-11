module ProtectPay {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::timestamp;
    
    struct WardAccount has key {
        daily_limit: u64,
        monthly_limit: u64,
        daily_spent: u64,
        monthly_spent: u64,
        last_daily_reset: u64,
        guardian_address: address,
    }

    struct PaymentRequest has key {
        amount: u64,
        status: bool, // false = pending, true = approved
        request_type: u8, // 0 = daily approval, 1 = money request
    }

    // Initialize ward account
    public entry fun initialize_ward_account(
        ward: &signer,
        guardian_address: address,
        daily_limit: u64,
        monthly_limit: u64
    ) {
        let ward_addr = signer::address_of(ward);
        
        move_to(ward, WardAccount {
            daily_limit,
            monthly_limit,
            daily_spent: 0,
            monthly_spent: 0,
            last_daily_reset: timestamp::now_seconds(),
            guardian_address
        });
    }

    // Make payment
    public entry fun make_payment(
        ward: &signer,
        amount: u64
    ) acquires WardAccount {
        let ward_addr = signer::address_of(ward);
        let ward_account = borrow_global_mut<WardAccount>(ward_addr);
        
        // Check if daily reset is needed
        if (timestamp::now_seconds() - ward_account.last_daily_reset >= 86400) {
            ward_account.daily_spent = 0;
            ward_account.last_daily_reset = timestamp::now_seconds();
        }

        assert!(
            ward_account.daily_spent + amount <= ward_account.daily_limit &&
            ward_account.monthly_spent + amount <= ward_account.monthly_limit,
            1000
        );

        ward_account.daily_spent = ward_account.daily_spent + amount;
        ward_account.monthly_spent = ward_account.monthly_spent + amount;
    }

    // Request approval
    public entry fun request_approval(
        ward: &signer,
        amount: u64,
        request_type: u8
    ) {
        let ward_addr = signer::address_of(ward);
        
        move_to(ward, PaymentRequest {
            amount,
            status: false,
            request_type
        });
    }

    // Approve request
    public entry fun approve_request(
        guardian: &signer,
        ward_address: address
    ) acquires PaymentRequest, WardAccount {
        let ward_account = borrow_global_mut<WardAccount>(ward_address);
        assert!(signer::address_of(guardian) == ward_account.guardian_address, 1001);
        
        let payment_request = borrow_global_mut<PaymentRequest>(ward_address);
        payment_request.status = true;
        
        if (payment_request.request_type == 0) {
            // Daily approval
            ward_account.daily_limit = ward_account.daily_limit + payment_request.amount;
        } else {
            // Money request
            coin::transfer<AptosCoin>(
                guardian,
                ward_address,
                payment_request.amount
            );
        }
    }
}