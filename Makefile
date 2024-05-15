# Solana SDK and toolchain paths
SOLANA_SDK?=$(HOME)/.cache/solana/v1.41
LLVM_DIR?=$(SOLANA_SDK)/platform-tools/llvm
CLANG:=$(LLVM_DIR)/bin/clang
LD:=$(LLVM_DIR)/bin/ld.lld

# Set src/out directory and compiler flags
SRC:=src/log
OUT:=build
DEPLOY:=deploy
ARCH:=-target sbf -march=bpfel+solana
LDFLAGS:=-shared -z notext --image-base 0x100000000

# Define the target
TARGET:=$(DEPLOY)/log.so

# Default target
all: $(TARGET)

# Build shared object
$(TARGET): $(OUT)/log.o ${SRC}/log.ld
	$(LD) $(LDFLAGS) -T ${SRC}/log.ld -o $@ $<

# Compile assembly
$(OUT)/log.o: ${SRC}/log.s
	mkdir -pv $(OUT)
	$(CLANG) -Os $(ARCH) -c -o $@ $<

# Prepare for deploy
deploy:
	@if [ ! -f $(DEPLOY)/log_keypair.json ]; then \
		echo "log_keypair.json does not exist. Creating..."; \
		solana-keygen new --no-bip39-passphrase --outfile $(DEPLOY)/log_keypair.json; \
	fi

# Cleanup
.PHONY: clean
clean:
	rm -rv $(OUT)

# Deploy rule can be run separately
.PHONY: deploy
