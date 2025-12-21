terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
  }

  # Backend configuration (uncomment and configure for remote state)
  # backend "s3" {
  #   bucket = "ecofarm-terraform-state"
  #   key    = "terraform.tfstate"
  #   region = "ap-south-1"
  # }
}

provider "aws" {
  region = var.aws_region
}

# VPC
resource "aws_vpc" "ecofarm_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "ecofarm-vpc"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "ecofarm_igw" {
  vpc_id = aws_vpc.ecofarm_vpc.id

  tags = {
    Name = "ecofarm-igw"
  }
}

# Public Subnet
resource "aws_subnet" "ecofarm_public" {
  vpc_id                  = aws_vpc.ecofarm_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "${var.aws_region}a"
  map_public_ip_on_launch = true

  tags = {
    Name = "ecofarm-public-subnet"
  }
}

# Private Subnet
resource "aws_subnet" "ecofarm_private" {
  vpc_id            = aws_vpc.ecofarm_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "${var.aws_region}b"

  tags = {
    Name = "ecofarm-private-subnet"
  }
}

# Route Table
resource "aws_route_table" "ecofarm_public_rt" {
  vpc_id = aws_vpc.ecofarm_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.ecofarm_igw.id
  }

  tags = {
    Name = "ecofarm-public-rt"
  }
}

resource "aws_route_table_association" "ecofarm_public_rta" {
  subnet_id      = aws_subnet.ecofarm_public.id
  route_table_id = aws_route_table.ecofarm_public_rt.id
}

# Security Group
resource "aws_security_group" "ecofarm_sg" {
  name        = "ecofarm-sg"
  description = "Security group for Eco Farm Platform"
  vpc_id      = aws_vpc.ecofarm_vpc.id

  ingress {
    description = "HTTP"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ecofarm-sg"
  }
}

# EKS Cluster (for Kubernetes)
resource "aws_eks_cluster" "ecofarm_cluster" {
  name     = "ecofarm-cluster"
  role_arn = aws_iam_role.eks_cluster_role.arn
  version  = "1.28"

  vpc_config {
    subnet_ids = [
      aws_subnet.ecofarm_public.id,
      aws_subnet.ecofarm_private.id
    ]
  }

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy
  ]
}

# IAM Role for EKS
resource "aws_iam_role" "eks_cluster_role" {
  name = "ecofarm-eks-cluster-role"

  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "eks.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster_role.name
}

# Variables
variable "aws_region" {
  description = "AWS region"
  default     = "ap-south-1"
}

# Outputs
output "vpc_id" {
  value = aws_vpc.ecofarm_vpc.id
}

output "cluster_name" {
  value = aws_eks_cluster.ecofarm_cluster.name
}


