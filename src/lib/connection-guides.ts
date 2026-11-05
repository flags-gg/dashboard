type Credentials = { projectId: string; agentId: string; environmentId: string };

type ConnectionGuide = {
  id: string;
  label: string;
  description: string;
  docs: string;
  install?: string;
  snippet: (credentials: Credentials) => string;
};

// Keep examples aligned with documentation/src/content/docs/sdks.
export const connectionGuides: ConnectionGuide[] = [
  {
    id: "react", label: "React", docs: "sdks/react/",
    description: "Wrap your app with FlagsProvider, then read flags with useFlags.",
    install: "npm install @flags-gg/react-library",
    snippet: ({ projectId, agentId, environmentId }) => `import { FlagsProvider } from "@flags-gg/react-library";

export default function App() {
  return (
    <FlagsProvider options={{
      projectId: "${projectId}",
      agentId: "${agentId}",
      environmentId: "${environmentId}",
    }}>
      <YourApp />
    </FlagsProvider>
  );
}`,
  },
  {
    id: "nextjs", label: "Next.js", docs: "sdks/nextjs/",
    description: "Create a client provider and wrap your layout's children with it.",
    install: "npm install @flags-gg/react-library",
    snippet: ({ projectId, agentId, environmentId }) => `// src/components/ClientProvider.tsx
"use client";

import type { ReactNode } from "react";
import { FlagsProvider } from "@flags-gg/react-library";

export default function ClientProvider({ children }: { children: ReactNode }) {
  return (
    <FlagsProvider options={{
      projectId: "${projectId}",
      agentId: "${agentId}",
      environmentId: "${environmentId}",
    }}>
      {children}
    </FlagsProvider>
  );
}

// In src/app/layout.tsx, import ClientProvider and wrap children:
// <body><ClientProvider>{children}</ClientProvider></body>`,
  },
  {
    id: "go", label: "Go", docs: "sdks/go/",
    description: "Initialize a Go client with this environment's credentials.",
    install: "go get github.com/flags-gg/go-flags",
    snippet: ({ projectId, agentId, environmentId }) => `package main

import (
    "fmt"
    flags "github.com/flags-gg/go-flags"
)

func main() {
    client := flags.NewClient(flags.WithAuth(flags.Auth{
        ProjectID: "${projectId}",
        AgentID: "${agentId}",
        EnvironmentID: "${environmentId}",
    }))
    fmt.Println(client.Is("my-feature").Enabled())
}`,
  },
  {
    id: "rust", label: "Rust", docs: "sdks/rust/",
    description: "Build an async Rust client with an in-memory cache.",
    install: 'cargo add flags-rs\ncargo add tokio --features macros,rt-multi-thread',
    snippet: ({ projectId, agentId, environmentId }) => `use flags_rs::{Auth, Client};

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = Client::builder()
        .with_auth(Auth {
            project_id: "${projectId}".to_string(),
            agent_id: "${agentId}".to_string(),
            environment_id: "${environmentId}".to_string(),
        })
        .with_memory_cache()
        .build()?;

    println!("{}", client.is("my-feature").enabled().await);
    Ok(())
}`,
  },
  {
    id: "python", label: "Python", docs: "sdks/python/",
    description: "Create a Python client and check flags with is_().",
    install: "pip install flags-gg",
    snippet: ({ projectId, agentId, environmentId }) => `from flags import new_client

client = new_client(
    project_id="${projectId}",
    agent_id="${agentId}",
    environment_id="${environmentId}",
)

if client.is_("my-feature").enabled():
    print("Feature is enabled!")`,
  },
  {
    id: "php", label: "PHP", docs: "sdks/php/",
    description: "Authenticate a PHP client after loading Composer's autoloader.",
    install: "composer require flags-gg/flags-php",
    snippet: ({ projectId, agentId, environmentId }) => `<?php
require_once 'vendor/autoload.php';

use FlagsGG\\Client;

$client = new Client();
$client->setAuth(
    projectId: '${projectId}',
    agentId: '${agentId}',
    environmentId: '${environmentId}'
);

if ($client->is('my-feature')->enabled()) {
    echo "Feature is enabled!";
}`,
  },
  {
    id: "csharp", label: "C#", docs: "sdks/csharp/",
    description: "Create a .NET client and evaluate flags asynchronously.",
    install: "dotnet add package Flags.GG",
    snippet: ({ projectId, agentId, environmentId }) => `using Flags.GG.Client;
using Flags.GG.Models;

using var client = FlagsClient.Create(options =>
{
    options.Auth = new Auth
    {
        ProjectId = "${projectId}",
        AgentId = "${agentId}",
        EnvironmentId = "${environmentId}"
    };
});

if (await client.Is("my-feature").EnabledAsync())
{
    Console.WriteLine("Feature is enabled!");
}`,
  },
  {
    id: "swift", label: "Swift", docs: "sdks/swift/",
    description: "Add the package in Xcode (File → Add Packages), then build a Swift client.",
    install: "https://github.com/flags-gg/swift.git",
    snippet: ({ projectId, agentId, environmentId }) => `import FlagsGG

let client = try Flags.builder()
    .withAuth(Auth(
        projectId: "${projectId}",
        agentId: "${agentId}",
        environmentId: "${environmentId}"
    ))
    .build()

let enabled = await client.is("my-feature").enabled()`,
  },
  {
    id: "kotlin", label: "Kotlin", docs: "sdks/kotlin/",
    description: "Add the Gradle dependency, then use the client from a coroutine.",
    install: 'dependencies {\n    implementation("gg.flags:flags-kotlin:1.1.0")\n}',
    snippet: ({ projectId, agentId, environmentId }) => `import gg.flags.client.Auth
import gg.flags.client.FlagsClient

suspend fun main() {
    val client = FlagsClient.builder()
        .auth(Auth(
            projectId = "${projectId}",
            agentId = "${agentId}",
            environmentId = "${environmentId}"
        ))
        .build()

    try {
        println(client.isEnabled("my-feature"))
    } finally {
        client.close()
    }
}`,
  },
  {
    id: "ruby", label: "Ruby", docs: "sdks/ruby/",
    description: "Build a Ruby client with an in-memory cache.",
    install: "gem install flags-gem",
    snippet: ({ projectId, agentId, environmentId }) => `require 'flags'

client = Flags::Client.builder
  .with_auth(Flags::Auth.new(
    project_id: '${projectId}',
    agent_id: '${agentId}',
    environment_id: '${environmentId}'
  ))
  .with_memory_cache
  .build

if client.is('my-feature').enabled?
  puts 'Feature is enabled!'
end`,
  },
  {
    id: "elixir", label: "Elixir", docs: "sdks/elixir/",
    description: "Add FlagsGG to your application's supervision tree.",
    install: '# In mix.exs dependencies:\n{:flags_gg, "~> 0.1"}\n\n# Then run:\nmix deps.get',
    snippet: ({ projectId, agentId, environmentId }) => `# lib/my_app/application.ex
def start(_type, _args) do
  children = [
    {FlagsGG,
      project_id: "${projectId}",
      agent_id: "${agentId}",
      environment_id: "${environmentId}"}
  ]

  Supervisor.start_link(children, strategy: :one_for_one, name: MyApp.Supervisor)
end

# Check a flag anywhere in your app:
# FlagsGG.enabled?("my-feature")`,
  },
  {
    id: "api", label: "REST API", docs: "api-reference/",
    description: "Fetch flags over HTTP from any language using these headers.",
    snippet: ({ projectId, agentId, environmentId }) => `curl "https://api.flags.gg/flags" \\
  -H "X-PROJECT-ID: ${projectId}" \\
  -H "X-AGENT-ID: ${agentId}" \\
  -H "X-ENVIRONMENT-ID: ${environmentId}"`,
  },
];
