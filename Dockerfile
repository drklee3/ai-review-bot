FROM oven/bun:1.1.38-debian

# Install curl
RUN apt-get update && apt-get install -y \
  curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the package.json and lock file to install dependencies, cache dependencies
# in it's own layer
COPY ./package.json ./bun.lockb ./
RUN bun install --frozen-lockfile

# Copy the rest of the files
COPY . ./

ENTRYPOINT [ "bun", "run", "./src/index.ts" ]
