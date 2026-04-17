#!/usr/bin/env sh
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
TMPDIR="${ROOT}/.supabase-docker-src"
BRANCH="${SUPABASE_DOCKER_BRANCH:-master}"

echo "==> Cloning supabase/supabase (sparse: docker/) ..."
rm -rf "${TMPDIR}"
git clone --filter=blob:none --no-checkout https://github.com/supabase/supabase "${TMPDIR}"
(
  cd "${TMPDIR}"
  git sparse-checkout set --cone docker
  git checkout "${BRANCH}" 2>/dev/null || git checkout main
)

echo "==> Copying volumes/ and utils/ into project root ..."
rm -rf "${ROOT}/volumes" "${ROOT}/utils"
cp -R "${TMPDIR}/docker/volumes" "${ROOT}/volumes"
cp -R "${TMPDIR}/docker/utils"   "${ROOT}/utils"

rm -rf "${TMPDIR}"

echo "==> Done."
echo "    Next steps:"
echo "      cp .env.example .env   # then edit secrets"
echo "      docker compose up -d"
