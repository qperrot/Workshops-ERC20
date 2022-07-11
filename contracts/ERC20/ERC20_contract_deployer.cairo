%lang starknet

from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.starknet.common.syscalls import deploy

# Define a storage variable for the salt.
@storage_var
func salt() -> (value : felt):
end

# Define a storage variable for the class hash of ERC20_contract.
@storage_var
func ERC20_class_hash() -> (value : felt):
end

# An event emitted whenever deploy_ERC20_contract() is called.
@event
func ERC20_contract_deployed(contract_address : felt):
end

@constructor
func constructor{
    syscall_ptr : felt*,
    pedersen_ptr : HashBuiltin*,
    range_check_ptr,
}(ERC20_class_hash_ : felt):
    ERC20_class_hash.write(value=ERC20_class_hash_)
    return ()
end

@external
func deploy_ERC20_contract{
    syscall_ptr : felt*,
    pedersen_ptr : HashBuiltin*,
    range_check_ptr,
}(ERC20_address : felt):
    let (current_salt) = salt.read()
    let (class_hash) = ERC20_class_hash.read()
    let (contract_address) = deploy(
        class_hash=class_hash,
        contract_address_salt=current_salt,
        constructor_calldata_size=1,
        constructor_calldata=cast(new (ERC20_address,), felt*),
    )
    salt.write(value=current_salt + 1)

    ERC20_contract_deployed.emit(
        contract_address=contract_address
    )
    return ()
end