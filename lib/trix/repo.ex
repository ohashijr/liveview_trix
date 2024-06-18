defmodule Trix.Repo do
  use Ecto.Repo,
    otp_app: :trix,
    adapter: Ecto.Adapters.Postgres
end
