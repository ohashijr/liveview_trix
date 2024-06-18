defmodule Trix.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false

  use Application

  @impl true
  def start(_type, _args) do
    children = [
      TrixWeb.Telemetry,
      Trix.Repo,
      {DNSCluster, query: Application.get_env(:trix, :dns_cluster_query) || :ignore},
      {Phoenix.PubSub, name: Trix.PubSub},
      # Start the Finch HTTP client for sending emails
      {Finch, name: Trix.Finch},
      # Start a worker by calling: Trix.Worker.start_link(arg)
      # {Trix.Worker, arg},
      # Start to serve requests, typically the last entry
      TrixWeb.Endpoint
    ]

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: Trix.Supervisor]
    Supervisor.start_link(children, opts)
  end

  # Tell Phoenix to update the endpoint configuration
  # whenever the application is updated.
  @impl true
  def config_change(changed, _new, removed) do
    TrixWeb.Endpoint.config_change(changed, removed)
    :ok
  end
end
