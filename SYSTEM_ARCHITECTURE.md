# ============================================================

# SYSTEM_ARCHITECTURE.md

# Syami AI - System Architecture Documentation

# Version: 1.0.0

# ============================================================

> This document describes the complete technical architecture of Syami AI.
> It explains how every major component communicates, how the project is organized, and how the architecture is designed for future expansion.

---

# 1. System Overview

Syami AI is a desktop AI assistant built around a modular architecture.

Instead of separating Chat Mode and Agent Mode into different applications, Syami AI is designed as **one desktop application with two operating modes**.

Both modes share the same backend, AI engine, database, memory, and configuration.

Only the user interface and available capabilities change.

---

# 2. High-Level Architecture

```
                    Syami AI

                  Electron Desktop
                         │
        ┌────────────────┴────────────────┐
        │                                 │
   Chat Mode UI                     Agent Mode UI
 (Full Desktop Window)           (Floating Overlay)
        │                                 │
        └────────────────┬────────────────┘
                         │
                  React Application
                         │
                  API Communication
                         │
                 Express Backend
                         │
      ┌──────────────────┼──────────────────┐
      │                  │                  │
      │                  │                  │
 MongoDB Atlas      Ollama AI        Future Services
      │             (Qwen Model)    Voice • Vision • Tools
      │                  │
      └──────────────────┴──────────────────┘
                         │
                  AI Response Pipeline
```

---

# 3. System Components

The system consists of six major layers.

## Layer 1

Desktop Runtime

Technology

Electron

Responsibilities

• Window Management

• Native Desktop APIs

• IPC Communication

• Future Floating Window

• Desktop Permissions

---

## Layer 2

Frontend

Technology

React + TypeScript

Responsibilities

• User Interface

• Navigation

• Chat Rendering

• Theme

• State Management

• User Interaction

---

## Layer 3

Backend

Technology

Node.js + Express

Responsibilities

• AI Requests

• Database Access

• Business Logic

• Future Tool Calling

• Conversation Management

---

## Layer 4

AI Engine

Technology

Ollama

Primary Model

Qwen 2.5

Responsibilities

• Natural Language Processing

• Response Generation

• Context Handling

---

## Layer 5

Database

Technology

MongoDB Atlas

Responsibilities

• Conversation History

• User Settings

• Memory

• Future Preferences

---

## Layer 6

Future Services

Examples

Voice

Vision

Desktop Automation

Browser Automation

Plugin System

These services remain independent from the core architecture.

---

# 4. Communication Flow

The frontend never communicates directly with Ollama or MongoDB.

All communication flows through the backend.

```
React UI

↓

Express Backend

↓

AI Service

↓

Ollama

↓

Generated Response

↓

Express Backend

↓

React UI
```

This architecture keeps the application secure, modular, and maintainable.

---

# 5. Electron Architecture

Electron consists of two major processes.

## Main Process

Responsibilities

• Window Creation

• Native APIs

• File System Access

• Desktop Integration

• Future Agent Overlay

---

## Renderer Process

Responsibilities

• React Application

• UI Rendering

• Chat Interface

• User Interaction

• State Management

---

## IPC Communication

The Main Process and Renderer Process communicate using Electron IPC.

Direct communication between UI and native desktop features should be avoided.

---

# 6. Frontend Architecture

The frontend is organized around reusable components.

Major responsibilities include:

• Layout

• Navigation

• Chat Interface

• Settings

• Theme Management

• State Management

Every screen should be built from reusable components.

No page should contain duplicated UI logic.

---

# 7. Backend Architecture

The backend acts as the central controller of the application.

Responsibilities include:

• API Endpoints

• AI Integration

• Conversation Management

• Database Access

• Error Handling

• Future Tool Execution

The backend should never contain UI logic.

---

# 8. Database Architecture

MongoDB Atlas stores application data.

Version 1 includes:

• Conversations

• Messages

• Settings

Future versions may include:

• User Profiles

• Long-Term Memory

• Plugins

• Personal Preferences

Database access should always go through Prisma.

---

# 9. AI Request Pipeline

Every conversation follows the same pipeline.

```
User Message

↓

React UI

↓

Express API

↓

Prompt Builder

↓

Ollama

↓

Generated Response

↓

Backend Formatter

↓

React UI
```

This pipeline ensures a consistent AI response regardless of whether the request comes from Chat Mode or Agent Mode.

---

# 10. Core Design Principles

The architecture follows these principles:

• Separation of Concerns

• Modular Design

• Reusable Components

• Strong Typing

• Shared Backend

• Shared Database

• Shared AI

• Future Scalability

Every future feature must respect these principles.

---

# End of Part 1

Next:
Part 2 — Chat Mode, Agent Mode, Voice Pipeline, Desktop Automation, Deployment Strategy, and Future System Expansion.

# ============================================================

# PART 2

# Application Modes, Future Expansion & Deployment

# ============================================================

---

# 11. Chat Mode Architecture

Chat Mode is the primary interface of Syami AI Version 1.

Purpose

Provide a modern desktop AI chat experience.

Interface

• Full Desktop Window

• Sidebar

• Chat History

• AI Conversation

• Settings

• Theme Switch

• Markdown Rendering

Responsibilities

• Send user messages

• Display AI responses

• Manage conversations

• Display chat history

• Store conversation state

Chat Mode should feel lightweight, responsive, and distraction-free.

---

# 12. Agent Mode Architecture

Agent Mode is introduced after Chat Mode reaches production quality.

Purpose

Transform Syami AI into a desktop assistant capable of interacting with the operating system.

Interface

Floating Overlay Window

Characteristics

• Always on Top

• Small Window

• Voice Interaction

• Quick Commands

• Minimal UI

Responsibilities

• Voice Input

• Voice Output

• Desktop Commands

• Browser Commands

• File Commands

Agent Mode uses the same backend and AI engine as Chat Mode.

Only the interface and available capabilities change.

---

# 13. Shared System Components

Both Chat Mode and Agent Mode share:

✓ AI Engine

✓ Backend

✓ Database

✓ Conversation Memory

✓ Settings

✓ Theme

✓ Language

✓ Future User Preferences

Duplicate implementations should never exist.

---

# 14. Voice Pipeline (Future)

Voice interaction follows this flow.

Microphone

↓

Speech Recognition

↓

Text Processing

↓

Express Backend

↓

Ollama AI

↓

Generated Response

↓

Text-to-Speech

↓

Speaker Output

This pipeline allows both English and Nepali conversations.

The architecture should support replacing the speech engine in the future without affecting the rest of the application.

---

# 15. Desktop Automation Pipeline

Desktop commands follow this flow.

Voice or Text Command

↓

Intent Detection

↓

Command Validator

↓

Desktop Action Manager

↓

Electron Main Process

↓

Operating System

↓

Result

↓

AI Response

Examples

• Open Chrome

• Open VS Code

• Open Folder

• Search Google

• Play Music

• Open YouTube

Every desktop action must be validated before execution.

Dangerous actions should require user confirmation.

---

# 16. Memory Strategy

Version 1

Conversation Memory

• Current Conversation

• Chat History

Future Versions

Long-Term Memory

Examples

• Preferred Language

• Communication Style

• Frequently Used Commands

• Favorite Applications

The memory system should remain modular so it can evolve without changing the overall architecture.

---

# 17. Security Principles

The application must follow these rules.

• Never expose secrets.

• Never hardcode credentials.

• Store configuration in environment variables.

• Validate every backend request.

• Restrict desktop actions to approved modules.

• Keep AI isolated behind the backend.

---

# 18. Deployment Strategy

Development

Electron + React + Express

↓

Testing

Local Desktop

↓

Packaging

Electron Builder

↓

Release

Windows Installer

Future releases may include:

• macOS

• Linux

Current focus remains Windows.

---

# 19. Scalability

The architecture is designed to support future modules without major restructuring.

Planned modules include:

• Wake Word Detection

• Vision AI

• OCR

• Plugin System

• Calendar

• Notes

• Reminders

• Workflow Automation

• Multi-Step AI Agent

Each new module should integrate through the backend rather than directly with the frontend.

---

# 20. Development Lifecycle

Every feature should follow this workflow.

Plan

↓

Design

↓

Implement

↓

Test

↓

Review

↓

Document

↓

Release

Documentation should always be updated alongside implementation.

---

# 21. Future Vision

The long-term objective is to transform Syami AI from a desktop chatbot into a complete desktop AI companion.

Future capabilities include:

• Natural Conversations

• Voice Assistant

• Desktop Automation

• Browser Automation

• File Management

• Vision AI

• Intelligent Memory

• Context Awareness

• Multi-Step Task Execution

The architecture documented here is intended to support these capabilities without requiring a complete redesign.

---

# 22. Final Architecture Summary

Syami AI is built around one unified architecture.

Electron provides the desktop runtime.

React renders the user interface.

Express manages application logic.

MongoDB Atlas stores persistent data.

Ollama powers local AI inference.

Chat Mode and Agent Mode share the same backend, AI engine, and database.

Only the user interface and available capabilities change.

This architecture prioritizes:

• Clean Design

• Modularity

• Scalability

• Reusability

• Performance

• Maintainability

Every future feature should extend this architecture rather than replace it.

---

# End of Document

SYSTEM_ARCHITECTURE.md

Version 1.0.0

Status:
Approved as the official system architecture for Syami AI.
