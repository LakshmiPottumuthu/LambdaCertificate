FROM gitpod/workspace-full

# Install latest Node.js LTS
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
RUN sudo apt-get install -y nodejs

# Needed for Playwright browsers
RUN sudo apt-get update
RUN sudo apt-get install -y libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libdbus-1-3 libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 \
    libgbm1 libpango-1.0-0 libasound2 libxshmfence1

ENV PLAYWRIGHT_BROWSERS_PATH=0
